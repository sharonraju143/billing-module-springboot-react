package com.billing.controller;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.billing.entity.Aws;
import com.billing.service.AwsService;

@RestController
@RequestMapping("/api/aws")
public class AwsController {

	@Autowired
	private AwsService awsService;

	@GetMapping("/month")
	public ResponseEntity<List<Aws>> getBillingDetailsForDuration(@RequestParam(name = "months") int months) {
		List<Aws> billingDetails = awsService.getBillingDetailsForDuration(months);
		return new ResponseEntity<>(billingDetails, HttpStatus.OK);
	}

	@GetMapping("/data/count")
	public Long getDataCount() {
		return awsService.getCountOfData();
	}

	@GetMapping("/getall")
	public ResponseEntity<List<Aws>> getAllServices() {
		List<Aws> awsData = awsService.getAllServices();
		System.out.println(awsData);
		return new ResponseEntity<List<Aws>>(awsData, HttpStatus.OK);
	}

	@PostMapping("/save")
	public ResponseEntity<Aws> save(@RequestBody Aws aws) {
		return ResponseEntity.status(HttpStatus.CREATED).body(awsService.save(aws));
	}

	@GetMapping("/service/startdate/enddate")
	public ResponseEntity<List<Aws>> getDataByServiceAndDateRange(@RequestParam String service,
			@RequestParam String startDate, @RequestParam String endDate) {
		List<Aws> data = awsService.getDataByServiceAndDateRange(service, startDate, endDate);
		return ResponseEntity.ok(data);
	}

	@GetMapping("/service/months")
	public ResponseEntity<List<Aws>> getBillingDetailsForDuration(@RequestParam("service") String service,
			@RequestParam("months") int months) {

		List<Aws> billingDetails = awsService.getBillingDetailsForDuration(service, months);

		if (billingDetails.isEmpty()) {
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.ok(billingDetails);
		}
	}

	@GetMapping("/billing-details")
	public ResponseEntity<Map<String, Object>> getBillingDetails(
			@RequestParam(value = "service", required = false) String service,
			@RequestParam(required = false) String startDate, @RequestParam(required = false) String endDate,
			@RequestParam(required = false) Integer months) {

		if (service == null && startDate == null && endDate == null && months == null) {
			Map<String, Object> emptyResponse = new LinkedHashMap<>();
			emptyResponse.put("billingDetails", Collections.emptyList());
			emptyResponse.put("monthlyTotalAmounts", Collections.emptyList());
			emptyResponse.put("totalAmount", 0.0);
			return ResponseEntity.ok(emptyResponse);
		}

		List<Aws> billingDetails = awsService.getBillingDetails(service, startDate, endDate, months);
		List<Map<String, Object>> monthlyTotalAmounts = awsService.getMonthlyTotalAmounts(service, startDate, endDate,
				months);
		Double totalAmount = awsService.getTotalAmount(service, startDate, endDate, months);

		// Create a response map
		Map<String, Object> response = new LinkedHashMap<>();
		response.put("billingDetails", billingDetails);
		response.put("monthlyTotalAmounts", monthlyTotalAmounts);
		response.put("totalAmount", totalAmount);

		if (billingDetails.isEmpty()) {
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.ok(response);
		}
	}

	@GetMapping("/distinct-services")
	public ResponseEntity<String[]> getDistinctServices() {
		String[] distinctServices = awsService.getUniqueServicesAsArray();
		if (distinctServices.length == 0) {
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.ok(distinctServices);
		}
	}

}
