package com.billing.service.impl;

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

import com.billing.entity.Azure;
import com.billing.repository.AzureRepository;
import com.billing.service.AzureService;

@Service
public class AzureServiceImpl implements AzureService {

	@Autowired
	private AzureRepository azureRepository;

	

	@Override
	public Long getCountOfData() {

		return azureRepository.count();
	}

	@Override
	public List<Azure> getAll() {
		
		return azureRepository.findAll();
	}

	@Override
	public List<String> getDistinctResourceType() {
		
		List<String> serviceDescriptions = azureRepository.findDistinctResourceTypeBy();
		return extractUniqueResourceType(serviceDescriptions);
	}

	private List<String> extractUniqueResourceType(List<String> resourceType) {
		Set<String> uniqueServiceSet = new HashSet<>();
		List<String> uniqueServiceList = new ArrayList<>();

		for (String jsonStr : resourceType) {
			String resourceType1 = extractResourceType(jsonStr);
			if (resourceType1 != null) {
				uniqueServiceSet.add(resourceType1);
			}
		}

		uniqueServiceList.addAll(uniqueServiceSet);
		return uniqueServiceList;
	}

	private String extractResourceType(String jsonStr) {

		int startIndex = jsonStr.indexOf("ResourceType\": \"") + "ResourceType\": \"".length();
		int endIndex = jsonStr.indexOf("\"", startIndex);
		if (startIndex >= 0 && endIndex >= 0) {
			return jsonStr.substring(startIndex, endIndex);
		}
		return null; // Return null if extraction fails
	}

	@Override
	public List<Azure> getAllDataBydateRange(String startDate, String endDate) {
		LocalDate start = LocalDate.parse(startDate);
		LocalDate end = LocalDate.parse(endDate);

		return azureRepository.findByusageDateBetween(start, end);
	}

	@Override
	public List<Azure> getAllDataByMonths(int months) {
		LocalDate endDate = LocalDate.now();
		LocalDate startDate = endDate.minusMonths(months - 1).withDayOfMonth(1);
		return azureRepository.findByusageDateBetween(startDate, endDate);
	}

	@Override
	public List<Azure> getDataByResourseTypeAndDateRange(String resourseType, String startDate, String endDate) {
		LocalDate start = LocalDate.parse(startDate);
		LocalDate end = LocalDate.parse(endDate);
		return azureRepository.findByResourceTypeAndUsageDateBetween(resourseType, start, end);
	}

	@Override
	public List<Azure> getDataByResourseTypeAndMonths(String resourseType, int months) {
		LocalDate endDate = LocalDate.now();
		LocalDate startDate = LocalDate.now().minusMonths(months - 1).withDayOfMonth(1);

		return azureRepository.findByResourceTypeAndUsageDateBetween(resourseType, startDate, endDate);
	}


	@Override
	public List<Azure> getBillingDetails(String resourceType, String startDate, String endDate, Integer months) {
	    List<Azure> billingDetails;

	    if (resourceType != null && startDate != null && endDate != null) {
	        billingDetails = getDataByResourseTypeAndDateRange(resourceType, startDate, endDate);
	    } else if (resourceType != null && months != null) {
	        billingDetails = getDataByResourseTypeAndMonths(resourceType, months);
	    } else if (months != null && resourceType == null) {
	        billingDetails = getAllDataByMonths(months);
	    } else if (startDate != null && endDate != null) {
	        billingDetails = getAllDataBydateRange(startDate, endDate);
	    } else {
	        throw new IllegalArgumentException("Please provide ResourceType and dates or dates or duration to get the data");
	    }

	    double totalCost = billingDetails.stream().mapToDouble(Azure::getCost).sum();
	    Map<String, Double> monthlyTotalBills = calculateMonthlyTotalBills(billingDetails);

	    // Calculate top 5 resource types only when filtering by months or dates
	    List<Map<String, Object>> top5ResourceTypes = new ArrayList<>();
	    if ((resourceType == null || resourceType.isEmpty())) {
	        top5ResourceTypes = getTop5ResourseType(billingDetails);
	    }
	    
	    
	

	    // Prepare the response map
	    Map<String, Object> response = new LinkedHashMap<>();
	    response.put("billingDetails", billingDetails);
	    response.put("totalCost", totalCost);
	    response.put("monthlyTotalBills", monthlyTotalBills);
	    if (!top5ResourceTypes.isEmpty()) {
	        response.put("top5ResourceTypes", top5ResourceTypes);
	    }

	    return billingDetails;
	}

	

	public List<Map<String, Object>> getTop5ResourseType(List<Azure> azureList) {
		Map<String, Double> resourseCostMap = new HashMap<>();

		// Calculate the total cost for each service description
		for (Azure gcp : azureList) {
			String resourseType = gcp.getResourceType();
			double cost = gcp.getCost();

			resourseCostMap.put(resourseType, resourseCostMap.getOrDefault(resourseType, 0.0) + cost);
		}

		// Sort service descriptions by cost in descending order
		List<Map.Entry<String, Double>> sortedresourse = resourseCostMap.entrySet().stream()
				.sorted(Map.Entry.<String, Double>comparingByValue().reversed()).collect(Collectors.toList());

		// Get the top 5 service descriptions
		List<Map<String, Object>> top5resourseTypes = new ArrayList<>();
		int count = 0;
		for (Map.Entry<String, Double> entry : sortedresourse) {
			Map<String, Object> resourseData = new HashMap<>();
			resourseData.put("resourseData", entry.getKey());
			resourseData.put("totalCost", entry.getValue());
			top5resourseTypes.add(resourseData);
			count++;
			if (count == 5) {
				break;
			}
		}

		return top5resourseTypes;
	}

	
	
	
	public Map<String, Double> calculateMonthlyTotalBills(List<Azure> billingDetails) {
	    // Map to store monthly total bills
	    Map<String, Double> monthlyTotalBills = new LinkedHashMap<>();

	    // Map to store month names
	    Map<Integer, String> monthNames = Map.ofEntries(
	            Map.entry(1, "January"), Map.entry(2, "February"), Map.entry(3, "March"),
	            Map.entry(4, "April"), Map.entry(5, "May"), Map.entry(6, "June"),
	            Map.entry(7, "July"), Map.entry(8, "August"), Map.entry(9, "September"),
	            Map.entry(10, "October"), Map.entry(11, "November"), Map.entry(12, "December")
	    );

	    for (Azure azure : billingDetails) {
	        @SuppressWarnings("deprecation")
			int monthNumber = azure.getUsageDate().getMonth();
	        String monthName = monthNames.get(monthNumber);

	        double cost = azure.getCost();
	        // If the month key exists in the map, add the cost; otherwise, put a new entry
	        monthlyTotalBills.put(monthName, monthlyTotalBills.getOrDefault(monthName, 0.0) + cost);
	    }

	    return monthlyTotalBills;
	}

	

	}


