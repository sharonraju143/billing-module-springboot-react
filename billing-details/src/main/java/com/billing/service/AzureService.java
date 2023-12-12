package com.billing.service;

import java.util.List;

import com.billing.entity.Azure;

public interface AzureService {

	public List<Azure> getBillingDetailsForDuration(int months);
	
	public Long getCountOfData();
}
