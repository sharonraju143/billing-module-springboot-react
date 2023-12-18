package com.billing.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
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
	public List<Map<String, Object>> getMonthlyTotalAmounts(String serviceName, String startDate, String endDate,
			Integer months) {
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
					return Collections.emptyList(); // No parameters provided, return empty list
				}
			}

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			Map<String, Double> monthlyAmounts = new TreeMap<>();

			for (Aws aws : billingDetails) {
				String month = getMonthFromDate(aws.getStartDate(), formatter); // Get month from date
				double amount = aws.getAmount();

				// If the month exists in the map, add the amount to the existing total
				if (monthlyAmounts.containsKey(month)) {
					double totalAmount = monthlyAmounts.get(month);
					totalAmount += amount;
					monthlyAmounts.put(month, totalAmount);
				} else {
					// If the month doesn't exist, add a new entry in the map
					monthlyAmounts.put(month, amount);
				}
			}
			Map<String, Integer> monthOrder = new LinkedHashMap<>();
			monthOrder.put("JANUARY", 1);
			monthOrder.put("FEBRUARY", 2);
			monthOrder.put("MARCH", 3);
			monthOrder.put("APRIL", 4);
			monthOrder.put("MAY", 5);
			monthOrder.put("JUNE", 6);
			monthOrder.put("JULY", 7);
			monthOrder.put("AUGUST", 8);
			monthOrder.put("SEPTEMBER", 9);
			monthOrder.put("OCTOBER", 10);
			monthOrder.put("NOVEMBER", 11);
			monthOrder.put("DECEMBER", 12);

			// Prepare the aggregated monthly total amounts list to return
			List<Map<String, Object>> aggregatedMonthlyTotalAmounts = new ArrayList<>();

			monthlyAmounts.entrySet().stream().sorted(Comparator.comparingInt(entry -> monthOrder.get(entry.getKey())))
					.forEach(entry -> {
						Map<String, Object> monthData = new HashMap<>();
						monthData.put("month", entry.getKey());
						monthData.put("amount", entry.getValue());
						aggregatedMonthlyTotalAmounts.add(monthData);
					});
			return aggregatedMonthlyTotalAmounts;

		} else {
			return Collections.emptyList(); // Return empty list when no parameters are provided
		}
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

	private String getMonthFromDate(String dateStr, DateTimeFormatter formatter) {
		LocalDate date = LocalDate.parse(dateStr, formatter);
		return date.getMonth().toString();
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
						String formattedService = "{ \"service\": \"" + serviceName + "\" }";
						formattedServiceNames.add(formattedService);
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
	
//	@Override
//	public List<Aws> getBillingDetails(String serviceName, String startDate, String endDate, Integer months) {
//	    List<Aws> billingDetails;
//
//	    if ((startDate != null && endDate != null) || (months != null && months > 0)) {
//	        if (serviceName != null && !serviceName.isEmpty()) {
//	            // If a specific service is selected
//	            if (startDate != null && endDate != null) {
//	                billingDetails = getDataByServiceAndDateRange(serviceName, startDate, endDate);
//	            } else {
//	                billingDetails = getBillingDetailsForDuration(serviceName, months);
//	            }
//	        } else {
//	            // If no specific service is selected
//	            if (startDate != null && endDate != null) {
//	                billingDetails = getAllDataByDateRange(startDate, endDate);
//	            } else if (months != null && months > 0) {
//	                billingDetails = getBillingDetailsForDuration(months);
//	            } else {
//	                throw new IllegalArgumentException("Please enter a valid duration in months");
//	            }
//	        }
//	    } else {
//	        throw new IllegalArgumentException("Please provide service and dates or a valid duration to get the data");
//	    }
//
//	    return billingDetails;
//	}


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
					//billingDetails = getAllServices(); // Get all AWS billing details
					throw new IllegalArgumentException("Please enter a valid duration in months");
				}
			}
		} else {
			//return Collections.emptyList(); // Return empty list when no parameters are provided
			throw new IllegalArgumentException("Please provide service and dates or dates or duration to get the data");
		}

	
//	public List<Aws> getBillingDetails(String serviceName, String startDate, String endDate, Integer months) {
//		List<Aws> billingDetails;
//		
//	    if ((startDate != null && endDate != null) || months != null) {
//	        if (serviceName != null && !serviceName.isEmpty()) {
//	            if (startDate != null && endDate != null) {
//	                return getDataByServiceAndDateRange(serviceName, startDate, endDate);
//	            } else {
//	                return getBillingDetailsForDuration(serviceName, months);
//	            }
//	        } else {
//	            if (startDate != null && endDate != null) {
//	                return getAllDataByDateRange(startDate, endDate);
//	            } else if (months != null) {
//	                return getBillingDetailsForDuration(months);
//	            } else {
//	                return getAllServices(); // Get all AWS billing details
//	            }
//	        }
//	    } else {
//	        throw new IllegalArgumentException("Please provide service and dates or dates or duration to get the data");
//	    }
//	}

		// Fetch top 10 services based on their amounts
		List<Map<String, Object>> top10Services = new ArrayList<>();
		if (serviceName == null || serviceName.isEmpty()) {

			top10Services = getTop10Services(billingDetails);
		}

		// Prepare the response map
		Map<String, Object> response = new LinkedHashMap<>();
		response.put("billingDetails", billingDetails);
		response.put("monthlyTotalAmounts", getMonthlyTotalAmounts(serviceName, startDate, endDate, months));
		response.put("totalAmount", getTotalAmount(serviceName, startDate, endDate, months));

		if (!top10Services.isEmpty()) {
			response.put("top10Services", top10Services);
		}

		return billingDetails;
	}

}
