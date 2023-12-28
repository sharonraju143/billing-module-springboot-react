package com.gcp.serviceimpl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gcp.entity.Gcp;
import com.gcp.exceptions.NoDataFoundException;
import com.gcp.repository.GcpRespository;
import com.gcp.service.GcpService;

@Service
public class GcpServiceImpl implements GcpService {

	@Autowired
	private GcpRespository gcpRepository;

	@Override
	public List<Gcp> getAllData() {

		return gcpRepository.findAll();
	}

	@Override 
	public List<String> getDistinctServiceDescriptions() {
		List<String> serviceDescriptions = gcpRepository.findDistinctServiceDescriptionBy();
		return extractUniqueServiceDescriptions(serviceDescriptions);
	}

	private List<String> extractUniqueServiceDescriptions(List<String> serviceDescriptions) {
		Set<String> uniqueServiceSet = new HashSet<>();
		List<String> uniqueServiceList = new ArrayList<>();

		for (String jsonStr : serviceDescriptions) {
			String serviceDescription = extractServiceDescription(jsonStr);
			if (serviceDescription != null) {
				uniqueServiceSet.add(serviceDescription);
			}
		}

		uniqueServiceList.addAll(uniqueServiceSet);
		return uniqueServiceList;
	}

	private String extractServiceDescription(String jsonStr) {

		int startIndex = jsonStr.indexOf("Service description\": \"") + "Service description\": \"".length();
		int endIndex = jsonStr.indexOf("\"", startIndex);
		if (startIndex >= 0 && endIndex >= 0) {
			return jsonStr.substring(startIndex, endIndex);
		}
		return null; // Return null if extraction fails
	}

	@Override
	public List<Gcp> getAllDataBydateRange(String startDate, String endDate) {

		LocalDate start = LocalDate.parse(startDate);
		LocalDate end = LocalDate.parse(endDate);

		return gcpRepository.findByDateBetween(start, end);
	}

	@Override
	public List<Gcp> getAllDataByMonths(int months) {
		LocalDate endDate = LocalDate.now();
		LocalDate startDate = endDate.minusMonths(months - 1).withDayOfMonth(1);
		return gcpRepository.findByDateBetween(startDate, endDate);
	}

	@Override
	public List<Gcp> getDataByServiceDescAndDateRange(String serviceDescription, String startDate, String endDate) {

		LocalDate start = LocalDate.parse(startDate);
		LocalDate end = LocalDate.parse(endDate);
		return gcpRepository.findByServiceDescriptionAndDateBetween(serviceDescription, start, end);
	}

	@Override
	public List<Gcp> getDataByServiceDescAndMonths(String serviceDesc, int months) {
		LocalDate endDate = LocalDate.now();
		LocalDate startDate = LocalDate.now().minusMonths(months - 1).withDayOfMonth(1);

		return gcpRepository.findByServiceDescriptionAndDateBetween(serviceDesc, startDate, endDate);
	}
	
	
	@Override
	public List<Gcp> getBillingDetails(String serviceDescription, String startDate, String endDate, Integer months) {
	    List<Gcp> billingDetails;

	    if (serviceDescription != null && startDate != null && endDate != null) {
	        billingDetails = getDataByServiceDescAndDateRange(serviceDescription, startDate, endDate);
	    } else if (serviceDescription != null && months != null) {
	        billingDetails = getDataByServiceDescAndMonths(serviceDescription, months);
	    } else if (months != null  ) {
	        billingDetails = getAllDataByMonths(months);
	    } else if (startDate != null && endDate != null ) {
	        billingDetails = getAllDataBydateRange(startDate, endDate);
	    } else {
	        throw new IllegalArgumentException("Please provide service and dates or dates or duration to get the data");
	    }
	    if (billingDetails == null || billingDetails.isEmpty()) {
	        // Return an empty list or throw an exception for "No data" scenario
	        // return new ArrayList<>(); // Empty list
	        throw new NoDataFoundException();
	    }

	    double totalCost = billingDetails.stream().mapToDouble(Gcp::getCost).sum();

	    // Calculate top 5 service descriptions regardless of filtering criteria
	    List<Map<String, Object>> top5Services = getTop5ServiceDescriptions(billingDetails);

	    // Calculate monthly total bills
	    Map<String, Double> monthlyTotalBills = calculateMonthlyTotalBills(billingDetails);

	    // Prepare the response map
	    Map<String, Object> response = new LinkedHashMap<>();
	    response.put("billingDetails", billingDetails);
	    response.put("totalCost", totalCost);
	    response.put("monthlyTotalBills", monthlyTotalBills);
	    if (!top5Services.isEmpty()) {
	        response.put("top5ServiceDescriptions", top5Services);
	    }

	    // Return the response map or adjust the return value as needed
	    return billingDetails;
	}


	public List<Map<String, Object>> getTop5ServiceDescriptions(List<Gcp> gcpList) {
		Map<String, Double> serviceCostMap = new HashMap<>();

		// Calculate the total cost for each service description
		for (Gcp gcp : gcpList) {
			String serviceDesc = gcp.getServiceDescription();
			double cost = gcp.getCost();

			serviceCostMap.put(serviceDesc, serviceCostMap.getOrDefault(serviceDesc, 0.0) + cost);
		}

		// Sort service descriptions by cost in descending order
		List<Map.Entry<String, Double>> sortedServices = serviceCostMap.entrySet().stream()
				.sorted(Map.Entry.<String, Double>comparingByValue().reversed()).collect(Collectors.toList());

		// Get the top 5 service descriptions
		List<Map<String, Object>> top5Services = new ArrayList<>();
		int count = 0;
		for (Map.Entry<String, Double> entry : sortedServices) {
			Map<String, Object> serviceData = new HashMap<>();
			serviceData.put("serviceDescription", entry.getKey());
			serviceData.put("totalCost", entry.getValue());
			top5Services.add(serviceData);
			count++;
			if (count == 5) {
				break;
			}
		}

		return top5Services;
	}

	
	
	
	public Map<String, Double> calculateMonthlyTotalBills(List<Gcp> billingDetails) {
	    // Map to store monthly total bills
	    Map<String, Double> monthlyTotalBills = new LinkedHashMap<>();

	    // Map to store month names
	    Map<Integer, String> monthNames = Map.ofEntries(
	            Map.entry(1, "January"), Map.entry(2, "February"), Map.entry(3, "March"),
	            Map.entry(4, "April"), Map.entry(5, "May"), Map.entry(6, "June"),
	            Map.entry(7, "July"), Map.entry(8, "August"), Map.entry(9, "September"),
	            Map.entry(10, "October"), Map.entry(11, "November"), Map.entry(12, "December")
	    );

	    for (Gcp gcp : billingDetails) {
	        @SuppressWarnings("deprecation")
			int monthNumber = gcp.getDate().getMonth();
	        String monthName = monthNames.get(monthNumber);

	        double cost = gcp.getCost();

	        // If the month key exists in the map, add the cost; otherwise, put a new entry
	        monthlyTotalBills.put(monthName, monthlyTotalBills.getOrDefault(monthName, 0.0) + cost);
	    }

	    return monthlyTotalBills;
	}




}
