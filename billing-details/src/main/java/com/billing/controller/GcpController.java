package com.billing.controller;

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

import com.billing.entity.Gcp;
import com.billing.service.GcpService;

@RequestMapping("/api/gcp")
@RestController
public class GcpController {

	@Autowired
	private GcpService gcpService;

	@GetMapping("/getAll")
	public ResponseEntity<List<Gcp>> getAll() {

		List<Gcp> getall = gcpService.getAllData();
		return new ResponseEntity<List<Gcp>>(getall, HttpStatus.OK);
	}

	@GetMapping("/distinctServiceDescriptions")
	public ResponseEntity<List<String>> getDistinctServiceDescriptions() {
		List<String> serviceName = gcpService.getDistinctServiceDescriptions();
		return ResponseEntity.ok(serviceName);
	}

	@GetMapping("/dataBetweenDates")
	public ResponseEntity<List<Gcp>> getDataBetweenDates(@RequestParam("startDate") String startDate,
			@RequestParam("endDate") String endDate) {
		List<Gcp> betweenDates = gcpService.getAllDataBydateRange(startDate, endDate);
		return ResponseEntity.ok(betweenDates);
	}

	@GetMapping("/dataByMonths")
	public ResponseEntity<List<Gcp>> getDataByMonths(@RequestParam("months") int months) {
		List<Gcp> betweenMonths = gcpService.getAllDataByMonths(months);
		return ResponseEntity.ok(betweenMonths);
	}

	@GetMapping("/serviceDesc/Dates")
	public ResponseEntity<List<Gcp>> getDataByServiceDespAndDates(
			@RequestParam("serviceDescription") String serviceDescription, @RequestParam("startDate") String startDate,
			@RequestParam("endDate") String endDate) {
		List<Gcp> betweenServiceAndDates = gcpService.getDataByServiceDescAndDateRange(serviceDescription, startDate,
				endDate);
		return ResponseEntity.ok(betweenServiceAndDates);
	}

	@GetMapping("/serviceDesc/months")
	public ResponseEntity<List<Gcp>> getDataByServicedescAndMonths(
			@RequestParam("serviceDescription") String serviceDescription,
			@RequestParam("months") int months){
		List<Gcp> betweenServiceAndMonths =gcpService.getDataByServiceDescAndMonths(serviceDescription,months);
		return ResponseEntity.ok(betweenServiceAndMonths);
	}
	
	
	@GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getBillingDetails(
            @RequestParam(required = false) String serviceDescription,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Integer months
    ) {
        List<Gcp> billingDetails = gcpService.getBillingDetails(serviceDescription, startDate, endDate, months);

        if (billingDetails.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new LinkedHashMap<>());
        }

        double totalCost = billingDetails.stream().mapToDouble(Gcp::getCost).sum();

        // Calculate top 5 service descriptions
        List<Map<String, Object>> top5Services = gcpService.getTop5ServiceDescriptions(billingDetails);

        // Calculate monthly total bills
        Map<String, Double> monthlyTotalBills = gcpService.calculateMonthlyTotalBills(billingDetails);

        // Prepare the response map
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("billingDetails", billingDetails);
        response.put("totalCost", totalCost);
        response.put("monthlyTotalBills", monthlyTotalBills);
        if (!top5Services.isEmpty()) {
            response.put("top5ServiceDescriptions", top5Services);
        }

        return ResponseEntity.ok(response);
    }

}
