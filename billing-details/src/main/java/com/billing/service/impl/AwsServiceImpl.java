package com.billing.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
	public List<Aws> getBillingDetails(String serviceName, String startDate, String endDate, Integer months) {
	    if ((startDate != null && endDate != null) || months != null) {
	        List<Aws> billingDetails;
	        if (startDate != null && endDate != null) {
	            billingDetails = getDataByServiceAndDateRange(serviceName, startDate, endDate);
	        } else {
	            billingDetails = getBillingDetailsForDuration(serviceName, months);
	        }
	        return billingDetails;
	    } else {
	        return Collections.emptyList(); // Return empty list when no parameters are provided
	    }
	}

	@Override
	public List<Map<String, Object>> getMonthlyTotalAmounts(String serviceName, String startDate, String endDate, Integer months) {
	    if ((startDate != null && endDate != null) || months != null) {
	        List<Aws> billingDetails;
	        if (startDate != null && endDate != null) {
	            billingDetails = getDataByServiceAndDateRange(serviceName, startDate, endDate);
	        } else {
	            billingDetails = getBillingDetailsForDuration(serviceName, months);
	        }

	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	        List<Map<String, Object>> monthlyTotalAmounts = new ArrayList<>();

	        for (Aws aws : billingDetails) {
	            Map<String, Object> monthData = new LinkedHashMap<>();
	            String month = getMonthFromDate(aws.getStartDate(), formatter).toLowerCase();
	            double amount = aws.getAmount();

	            monthData.put("month", month);
	            monthData.put("amount", amount);

	            monthlyTotalAmounts.add(monthData);
	        }

	        return monthlyTotalAmounts;
	    } else {
	        return Collections.emptyList(); // Return empty list when no parameters are provided
	    }
	}

	@Override
	public Double getTotalAmount(String serviceName, String startDate, String endDate, Integer months) {
	    if ((startDate != null && endDate != null) || months != null) {
	        List<Aws> billingDetails;
	        if (startDate != null && endDate != null) {
	            billingDetails = getDataByServiceAndDateRange(serviceName, startDate, endDate);
	        } else {
	            billingDetails = getBillingDetailsForDuration(serviceName, months);
	        }

	        Double totalAmount = billingDetails.stream()
	                .mapToDouble(Aws::getAmount)
	                .sum();

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
		public List<Aws> getTop5BillingDetails(String serviceName, String startDate, String endDate, Integer months) {
			// TODO Auto-generated method stub
			return null;
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





}
