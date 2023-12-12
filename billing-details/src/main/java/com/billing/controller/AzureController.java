package com.billing.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.billing.entity.Azure;
import com.billing.service.AzureService;

@RestController
@RequestMapping("/api/azure")
public class AzureController {

	@Autowired
	private AzureService azureService;

	@GetMapping("/month")
	public ResponseEntity<List<Azure>> getBillingDetailsForDuration(@RequestParam(name = "months") int months) {
		List<Azure> billingDetails = azureService.getBillingDetailsForDuration(months);
		return new ResponseEntity<>(billingDetails, HttpStatus.OK);
	}
	
	 @GetMapping("/data/count")
	    public Long getDataCount() {
	        return azureService.getCountOfData();
	    }
}
