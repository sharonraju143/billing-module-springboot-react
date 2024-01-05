package com.billing.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.billing.entity.Aws;
import com.billing.repository.AwsRepository;
import com.billing.service.AwsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class AwsServiceImpl implements AwsService {

	@Autowired
	private AwsRepository awsRepository;

	@Override
	public List<Aws> getBillingDetailsForDuration(int months) {
		LocalDate currentDate = LocalDate.now();
		LocalDate startDate = currentDate.minusMonths(months);
		String startDateStr = startDate.toString();
		String currentDateStr = currentDate.toString();

		return awsRepository.findByStartDateBetween(startDateStr, currentDateStr);
	}

	@Override
	public List<Aws> getAllServices() {
		List<Aws> awsData = awsRepository.findAll();
		return awsData;
	}

	@Override
	public Long getCountOfData() {

		return awsRepository.count();
	}

	@Override
	public Aws save(Aws aws) {

		return awsRepository.save(aws);
	}

	@Override
	public List<Aws> getDataByServiceAndDateRange(String service, String startDate, String endDate) {

		return awsRepository.findByServiceAndStartDateGreaterThanEqualAndEndDateLessThanEqual(service, startDate,
				endDate);
	}

	@Override
	public List<Aws> getBillingDetailsForDuration(String service, String months) {

		return awsRepository.findByServiceAndStartDateGreaterThanEqual(service, months);
	}

	@Override
	public List<Aws> getBillingDetailsForDuration(String serviceName, int months) {
		LocalDate currentDate = LocalDate.now();
		LocalDate startDate = currentDate.minusMonths(months);

		String startDateStr = startDate.toString();

		return awsRepository.findByServiceAndStartDateGreaterThanEqual(serviceName, startDateStr);
	}

	@Override
	  public List<Map<String, Double>> calculateMonthlyTotalBills(List<Aws> billingDetails) {
        Map<String, Double> monthlyTotalBillsMap = new LinkedHashMap<>();
        Map<Integer, String> monthNames = Map.ofEntries(
                Map.entry(1, "January"), Map.entry(2, "February"), Map.entry(3, "March"),
                Map.entry(4, "April"), Map.entry(5, "May"), Map.entry(6, "June"),
                Map.entry(7, "July"), Map.entry(8, "August"), Map.entry(9, "September"),
                Map.entry(10, "October"), Map.entry(11, "November"), Map.entry(12, "December")
        );

        for (Aws aws : billingDetails) {
            String usageDate = aws.getStartDate(); // Assuming this gives a date string in format "yyyy-MM-dd"

            // Parse the usage date to extract year and month
            String[] dateParts = usageDate.split("-");
            int year = Integer.parseInt(dateParts[0]);
            int monthNumber = Integer.parseInt(dateParts[1]);
            String monthName = monthNames.get(monthNumber);

            double cost = aws.getAmount();
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
            int monthOrder1 = getMonthOrder(monthNames, parts1[0]);
            int monthOrder2 = getMonthOrder(monthNames, parts2[0]);

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

    private int getMonthOrder(Map<Integer, String> monthNames, String monthName) {
        return monthNames.entrySet().stream()
                .filter(entry -> entry.getValue().equalsIgnoreCase(monthName))
                .findFirst()
                .map(Map.Entry::getKey)
                .orElse(-1);
    }

	

	
	@Override
	public String[] getUniqueServicesAsArray() {
		List<String> uniqueServiceList = awsRepository.findDistinctByService();
		Set<String> uniqueServiceNames = new HashSet<>();
		List<String> formattedServiceNames = new ArrayList<>();

		for (String jsonStr : uniqueServiceList) {
			try {
				ObjectMapper mapper = new ObjectMapper();
				JsonNode node = mapper.readTree(jsonStr);
				JsonNode serviceNode = node.get("Service");
				if (serviceNode != null) {
					String serviceName = serviceNode.textValue();
					if (uniqueServiceNames.add(serviceName)) {
						formattedServiceNames.add(serviceName);
					}
				}
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
		}

		return formattedServiceNames.toArray(new String[0]);
	}

	@Override
	public List<Aws> getAllDataByDateRange(String startDate, String endDate) {
		// TODO Auto-generated method stub
		return awsRepository.findByStartDateGreaterThanEqualAndEndDateLessThanEqual(startDate, endDate);
	}

	@Override
	public Double getTotalAmount(String serviceName, String startDate, String endDate, Integer months) {
		List<Aws> billingDetails;

		if ((startDate != null && endDate != null) || months != null) {
			if (serviceName != null && !serviceName.isEmpty()) {
				// If a specific service is selected
				if (startDate != null && endDate != null) {
					billingDetails = getDataByServiceAndDateRange(serviceName, startDate, endDate);
				} else {
					billingDetails = getBillingDetailsForDuration(serviceName, months);
				}
			} else {
				// If no specific service is selected
				if (months != null) {
					billingDetails = getBillingDetailsForDuration(months); // Fetch data by duration
				} else if (startDate != null && endDate != null) {
					billingDetails = getAllDataByDateRange(startDate, endDate); // Fetch data by date range
				} else {
					return 0.0; // No parameters provided, return 0.0
				}
			}

			Double totalAmount = billingDetails.stream().mapToDouble(Aws::getAmount).sum();
			return totalAmount;
		} else {
			return 0.0; // Return 0 when no parameters are provided
		}
	}
	
	@Override
	public List<Map<String, Object>> getTop10Services(List<Aws> billingDetails) {
		// Create a map to store the total amount for each service
		Map<String, Double> serviceAmountMap = new HashMap<>();

		// Calculate the total amount for each service
		for (Aws aws : billingDetails) {
			String serviceName = aws.getService();
			double amount = aws.getAmount();

			// If the service already exists in the map, add the amount to its total
			// Otherwise, create a new entry for the service
			if (serviceAmountMap.containsKey(serviceName)) {
				double totalAmount = serviceAmountMap.get(serviceName) + amount;
				serviceAmountMap.put(serviceName, totalAmount);
			} else {
				serviceAmountMap.put(serviceName, amount);
			}
		}

		// Sort the services by their total amount in descending order
		List<Map.Entry<String, Double>> sortedServices = serviceAmountMap.entrySet().stream()
				.sorted(Map.Entry.<String, Double>comparingByValue().reversed()).collect(Collectors.toList());

		// Fetch the top 10 services based on their amounts
		List<Map<String, Object>> top10Services = new ArrayList<>();
		int count = 0;
		for (Map.Entry<String, Double> entry : sortedServices) {
			if (count < 5) {
				Map<String, Object> serviceData = new LinkedHashMap<>();
				serviceData.put("serviceName", entry.getKey());
				serviceData.put("amount", entry.getValue());
				top10Services.add(serviceData);
				count++;
			} else {
				break; // Exit loop after fetching the top 10 services
			}
		}

		return top10Services;
	}

	
	
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



	
	
	@Override
	public List<Aws> getBillingDetails(String serviceName, String startDate, String endDate, Integer months) {
		List<Aws> billingDetails;

		if ((startDate != null && endDate != null) || (months != null && months > 0)) {
			if (serviceName != null && !serviceName.isEmpty()) {
				// If a specific service is selected
				if (startDate != null && endDate != null) {
					billingDetails = getDataByServiceAndDateRange(serviceName, startDate, endDate);
				} else {
					billingDetails = getBillingDetailsForDuration(serviceName, months);
				}
			} else {
				// If no specific service is selected
				if (startDate != null && endDate != null) {
					billingDetails = getAllDataByDateRange(startDate, endDate);
				} else if (months != null && months > 0) {
					billingDetails = getBillingDetailsForDuration(months);
				} else {
					// billingDetails = getAllServices(); // Get all AWS billing details
					throw new IllegalArgumentException("Please enter a valid duration in months");
				}
			}
		} else {
			// return Collections.emptyList(); // Return empty list when no parameters are
			// provided
			throw new IllegalArgumentException("Please provide service and dates or dates or duration to get the data");
		}

		// Fetch top 10 services based on their amounts
		List<Map<String, Object>> top10Services = new ArrayList<>();
		if (serviceName == null || serviceName.isEmpty()) {

			top10Services = getTop10Services(billingDetails);
		}

		// Prepare the response map
		Map<String, Object> response = new LinkedHashMap<>();
		response.put("billingDetails", billingDetails);
		//response.put("monthlyTotalAmounts", getMonthlyTotalAmounts(serviceName, startDate, endDate, months));
		response.put("totalAmount", getTotalAmount(serviceName, startDate, endDate, months));
		response.put("monthlyTotalAmounts",calculateMonthlyTotalBills(billingDetails));
		response.put("BillingPeriod", generateBillingPeriod(startDate, endDate, months)); 
		
		if (!top10Services.isEmpty()) {
			response.put("top10Services", top10Services);
		}

		return billingDetails;
	}

}
