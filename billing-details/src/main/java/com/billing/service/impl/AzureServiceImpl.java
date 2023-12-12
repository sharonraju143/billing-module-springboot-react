package com.billing.service.impl;

import java.time.LocalDate;
import java.util.List;

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
	public List<Azure> getBillingDetailsForDuration(int months) {
		LocalDate currentDate = LocalDate.now();
		LocalDate startDate = currentDate.minusMonths(months);
		return azureRepository.findByusageDateBetween(startDate, currentDate);

	}

	@Override
	public Long getCountOfData() {
		
		return azureRepository.count();
	}

}
