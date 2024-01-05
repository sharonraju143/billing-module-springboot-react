package com.azure.serviceimpl;


import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.azure.entity.Azure;
import com.azure.repository.AzureRepository;
import com.azure.service.AzureService;

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
			throw new IllegalArgumentException(
					"Please provide ResourceType and dates or dates or duration to get the data");
		}

		double totalCost = billingDetails.stream().mapToDouble(Azure::getCost).sum();
		List<Map<String, Double>> monthlyTotalBills = calculateMonthlyTotalBills(billingDetails);

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
		response.put("BillingPeriod", generateBillingPeriod(startDate, endDate, months));
		
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
			resourseData.put("resourseType", entry.getKey());
			resourseData.put("totalCost", entry.getValue());
			top5resourseTypes.add(resourseData);
			count++;
			if (count == 5) {
				break;
			}
		}

		return top5resourseTypes;
	}

//	public Map<String, Double> calculateMonthlyTotalBills(List<Azure> billingDetails) {
//		// Map to store monthly total bills
//		Map<String, Double> monthlyTotalBills = new LinkedHashMap<>();
//		// Map to store month names
//		Map<Integer, String> monthNames = Map.ofEntries(Map.entry(0, "January"), Map.entry(1, "February"),
//				Map.entry(2, "March"), Map.entry(3, "April"), Map.entry(4, "May"), Map.entry(5, "June"),
//				Map.entry(6, "July"), Map.entry(7, "August"), Map.entry(8, "September"), Map.entry(9, "October"),
//				Map.entry(10, "November"), Map.entry(11, "December"));
//
//		for (Azure azure : billingDetails) {
//			@SuppressWarnings("deprecation")
//			int monthNumber = azure.getUsageDate().getMonth();
//			String monthName = monthNames.get(monthNumber);
//
//			double cost = azure.getCost();
//			// If the month key exists in the map, add the cost; otherwise, put a new entry
//			monthlyTotalBills.put(monthName, monthlyTotalBills.getOrDefault(monthName, 0.0) + cost);
//		}
//
//		return monthlyTotalBills;
//	}
	
	
//	public Map<String, Double> calculateMonthlyTotalBills(List<Azure> billingDetails) {
//	    // Map to store monthly total bills
//	    Map<String, Double> monthlyTotalBills = new LinkedHashMap<>();
//	    // Map to store month names
//	    Map<Integer, String> monthNames = Map.ofEntries(
//	            Map.entry(1, "January"), Map.entry(2, "February"), Map.entry(3, "March"),
//	            Map.entry(4, "April"), Map.entry(5, "May"), Map.entry(6, "June"),
//	            Map.entry(7, "July"), Map.entry(8, "August"), Map.entry(9, "September"),
//	            Map.entry(10, "October"), Map.entry(11, "November"), Map.entry(12, "December")
//	    );
//
//	    for (Azure azure : billingDetails) {
//	        Date usageDate = azure.getUsageDate();
//	        Calendar calendar = Calendar.getInstance();
//	        calendar.setTime(usageDate);
//	        int monthNumber = calendar.get(Calendar.MONTH) + 1; // Adding 1 to match the map keys
//	        String monthName = monthNames.get(monthNumber);
//
//	        double cost = azure.getCost();
//	        // If the month key exists in the map, add the cost; otherwise, put a new entry
//	        monthlyTotalBills.put(monthName, monthlyTotalBills.getOrDefault(monthName, 0.0) + cost);
//	    }
//
//	    return monthlyTotalBills;
//	}


//	public List<Map<String, Double>> calculateMonthlyTotalBills(List<Azure> billingDetails) {
//	    Map<String, Double> monthlyTotalBillsMap = new LinkedHashMap<>();
//	    Map<Integer, String> monthNames = Map.ofEntries(
//	            Map.entry(1, "January"), Map.entry(2, "February"), Map.entry(3, "March"),
//	            Map.entry(4, "April"), Map.entry(5, "May"), Map.entry(6, "June"),
//	            Map.entry(7, "July"), Map.entry(8, "August"), Map.entry(9, "September"),
//	            Map.entry(10, "October"), Map.entry(11, "November"), Map.entry(12, "December")
//	    );
//
//	    for (Azure azure : billingDetails) {
//	        Date usageDate = azure.getUsageDate();
//	        Calendar calendar = Calendar.getInstance();
//	        calendar.setTime(usageDate);
//	        int monthNumber = calendar.get(Calendar.MONTH) + 1; // Adding 1 to match the map keys
//	        String monthName = monthNames.get(monthNumber);
//
//	        double cost = azure.getCost();
//	        // If the month key exists in the map, add the cost; otherwise, put a new entry
//	        monthlyTotalBillsMap.put(monthName, monthlyTotalBillsMap.getOrDefault(monthName, 0.0) + cost);
//	    }
//
//	    List<Map<String, Double>> monthlyTotalBillsList = new ArrayList<>();
//	    for (Map.Entry<String, Double> entry : monthlyTotalBillsMap.entrySet()) {
//	        Map<String, Double> monthEntry = new LinkedHashMap<>();
//	        monthEntry.put(entry.getKey(), entry.getValue());
//	        monthlyTotalBillsList.add(monthEntry);
//	    }
//
//	    return monthlyTotalBillsList;
//	}
	
	
	@Override
	public List<Map<String, Double>> calculateMonthlyTotalBills(List<Azure> billingDetails) {
	    Map<String, Double> monthlyTotalBillsMap = new LinkedHashMap<>();
	    Map<Integer, String> monthNames = Map.ofEntries(
	            Map.entry(1, "January"), Map.entry(2, "February"), Map.entry(3, "March"),
	            Map.entry(4, "April"), Map.entry(5, "May"), Map.entry(6, "June"),
	            Map.entry(7, "July"), Map.entry(8, "August"), Map.entry(9, "September"),
	            Map.entry(10, "October"), Map.entry(11, "November"), Map.entry(12, "December")
	    );

	    for (Azure azure: billingDetails) {
	        Date usageDate = azure.getUsageDate();
	        Calendar calendar = Calendar.getInstance();
	        calendar.setTime(usageDate);
	        int year = calendar.get(Calendar.YEAR);
	        int monthNumber = calendar.get(Calendar.MONTH) + 1; // Adding 1 to match the map keys
	        String monthName = monthNames.get(monthNumber);

	        double cost = azure.getCost();
	        String monthYear = monthName + "-" + year;

	        // If the month key exists in the map, add the cost; otherwise, put a new entry
	        monthlyTotalBillsMap.put(monthYear, monthlyTotalBillsMap.getOrDefault(monthYear, 0.0) + cost);
	    }

	    // Sort the monthly total bills by year and month
	    List<Map.Entry<String, Double>> sortedBills = new ArrayList<>(monthlyTotalBillsMap.entrySet());
	    Collections.sort(sortedBills, (entry1, entry2) -> {
	        String[] parts1 = entry1.getKey().split("-");
	        String[] parts2 = entry2.getKey().split("-");
	        int year1 = Integer.parseInt(parts1[1]);
	        int year2 = Integer.parseInt(parts2[1]);
	        int monthOrder1 = monthNames.entrySet().stream()
	                .filter(entry -> entry.getValue().equalsIgnoreCase(parts1[0]))
	                .map(Map.Entry::getKey)
	                .findFirst().orElse(-1);
	        int monthOrder2 = monthNames.entrySet().stream()
	                .filter(entry -> entry.getValue().equalsIgnoreCase(parts2[0]))
	                .map(Map.Entry::getKey)
	                .findFirst().orElse(-1);
	        if (year1 != year2) {
	            return Integer.compare(year1, year2);
	        }
	        return Integer.compare(monthOrder1, monthOrder2);
	    });

	    List<Map<String, Double>> monthlyTotalBillsList = new ArrayList<>();
	    for (Map.Entry<String, Double> entry : sortedBills) {
	        Map<String, Double> monthEntry = new LinkedHashMap<>();
	        monthEntry.put(entry.getKey(), entry.getValue());
	        monthlyTotalBillsList.add(monthEntry);
	    }

	    return monthlyTotalBillsList;
	}

//	public List<Map<String, Object>> generateBillingPeriod(String startDate, String endDate, Integer months) {
//	    List<Map<String, Object>> billingPeriod = new ArrayList<>();
//	    Map<String, Object> periodData = new HashMap<>();
//	    if (months != null && months > 0) {
//	    	 LocalDate currentDate = LocalDate.now();
//
//	         // Calculate start date based on months from the current date
//	         LocalDate startDate1 = currentDate.minusMonths(months - 1);
//
//	         // Generate the period data
//	         periodData.put("BillingPeriod", startDate1 + " to " + currentDate);
//	         billingPeriod.add(periodData);
//	    } else if (startDate != null && endDate != null) {
//	        // Logic for start date and end date
//	        Map<String, Object> periodData1 = new HashMap<>();
//	        periodData1.put("period", startDate + " to " + endDate);
//	        billingPeriod.add(periodData1);
//	    }
//
//	    return billingPeriod;
//	}
	
	public List<Map<String, Object>> generateBillingPeriod(String startDate, String endDate, Integer months) {
	    List<Map<String, Object>> billingPeriod = new ArrayList<>();
	    Map<String, Object> periodData = new HashMap<>();
	    
	    if (months != null && months > 0) {
	        LocalDate currentDate = LocalDate.now();
	        
	        // Calculate the start date as the first day of the month 'months' months ago
	        LocalDate startDate1 = currentDate.minusMonths(months - 1).withDayOfMonth(1);
	        
	        // Format the dates
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy", Locale.ENGLISH);
	        String formattedStartDate = startDate1.format(formatter);
	        String formattedEndDate = currentDate.format(formatter);
	        
	        // Generate the period data with the desired format
	        periodData.put("BillingPeriod", formattedStartDate + " to " + formattedEndDate);
	        billingPeriod.add(periodData);
	    } else if (startDate != null && endDate != null) {
	        // Logic for start date and end date
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy", Locale.ENGLISH);
	        LocalDate parsedStartDate = LocalDate.parse(startDate);
	        LocalDate parsedEndDate = LocalDate.parse(endDate);
	        
	        String formattedStartDate = parsedStartDate.format(formatter);
	        String formattedEndDate = parsedEndDate.format(formatter);
	        
	        Map<String, Object> periodData1 = new HashMap<>();
	        periodData1.put("BillingPeriod", formattedStartDate + " to " + formattedEndDate);
	        billingPeriod.add(periodData1);
	    }

	    return billingPeriod;
	}


}
