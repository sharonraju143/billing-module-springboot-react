package com.azure.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.azure.entity.Azure;
import com.azure.service.AzureService;

@RestController
@RequestMapping("/azure")
public class AzureController {

	@Autowired
	private AzureService azureService;

	
	 @GetMapping("/data/count")
	    public Long getDataCount() {
	        return azureService.getCountOfData();
	    }
	 
	 
	 @GetMapping("/getall")
	 public ResponseEntity<List<Azure>> getAllData(){
		 List<Azure> getData = azureService.getAll();
		 return ResponseEntity.ok(getData);
	 }
	 
	 
	 @GetMapping("/distinctresourceType")
		public ResponseEntity<List<String>> getDistinctResourceType() {
			List<String> resource = azureService.getDistinctResourceType();
			return ResponseEntity.ok(resource);
		}
	 

		@GetMapping("/dataBetweenDates")
		public ResponseEntity<List<Azure>> getDataBetweenDates(@RequestParam("startDate") String startDate,
				@RequestParam("endDate") String endDate) {
			List<Azure> betweenDates = azureService.getAllDataBydateRange(startDate, endDate);
			return ResponseEntity.ok(betweenDates);
		}
	 
	 
		
		@GetMapping("/dataByMonths")
		public ResponseEntity<List<Azure>> getDataByMonths(@RequestParam("months") int months) {
			List<Azure> betweenMonths = azureService.getAllDataByMonths(months);
			return ResponseEntity.ok(betweenMonths);
		}
		
		
		@GetMapping("/resourcetype/Dates")
		public ResponseEntity<List<Azure>> getDataByServiceDespAndDates(
				@RequestParam("ResourseType") String resourseType, @RequestParam("startDate") String startDate,
				@RequestParam("endDate") String endDate) {
			List<Azure> betweenServiceAndDates = azureService.getDataByResourseTypeAndDateRange(resourseType, startDate,
					endDate);
			return ResponseEntity.ok(betweenServiceAndDates);
		}
		
		
		
		@GetMapping("/resourseType/months")
		public ResponseEntity<List<Azure>> getDataByServicedescAndMonths(
				@RequestParam("ResourseType") String serviceDescription,
				@RequestParam("months") int months){
			List<Azure> betweenServiceAndMonths =azureService.getDataByResourseTypeAndMonths(serviceDescription,months);
			return ResponseEntity.ok(betweenServiceAndMonths);
		}
		
		

		    @GetMapping("/details")
		    public ResponseEntity<Map<String, Object>> getBillingDetails(
		            @RequestParam(value="ResourseType",required = false) String resourceType,
		            @RequestParam(required = false) String startDate,
		            @RequestParam(required = false) String endDate,
		            @RequestParam(required = false) Integer months
		    ) {
		        List<Azure> billingDetails = azureService.getBillingDetails(resourceType, startDate, endDate, months);

		        if (billingDetails.isEmpty()) {
		            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new LinkedHashMap<>());
		        }

		        double totalCost = billingDetails.stream().mapToDouble(Azure::getCost).sum();
		        Map<String, Double> monthlyTotalBills = azureService.calculateMonthlyTotalBills(billingDetails);
		        List<Map<String, Object>> top5ResourceTypes = new ArrayList<>();

		        // Check if only resourceType is selected
		        if (resourceType != null && startDate == null && endDate == null && months == null) {
		            // If only resourceType is selected, return only billingDetails, totalCost, and monthlyTotalBills
		            Map<String, Object> response = new LinkedHashMap<>();
		            response.put("billingDetails", billingDetails);
		            response.put("totalCost", totalCost);
		            response.put("monthlyTotalBills", monthlyTotalBills);
		            return ResponseEntity.ok(response);
		        }

		        // If other parameters (startDate, endDate, months) are used, get top 5 resource types
		        top5ResourceTypes = azureService.getTop5ResourseType(billingDetails);

		        // Prepare the response map
		        Map<String, Object> response = new LinkedHashMap<>();
		        response.put("billingDetails", billingDetails);
		        response.put("totalCost", totalCost);
		        response.put("monthlyTotalBills", monthlyTotalBills);
		        if (!top5ResourceTypes.isEmpty()) {
		            response.put("top5ResourceTypes", top5ResourceTypes);
		        }

		        return ResponseEntity.ok(response);
		    }
		}

		

		

		



