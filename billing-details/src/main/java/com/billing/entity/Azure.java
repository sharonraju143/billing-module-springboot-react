package com.billing.entity;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Azure")
public class Azure {
	
	    @Id
	    private String id;
	    private String resourceId;
	    private String resourceType;
	    private String resourceLocation;
	    private String resourceGroupName;
	    private String serviceName;
	    private String meter;
	    private String tags;
	    private double costUSD;
	    private double cost;
	    private String currency;


	    private Date usageDate;
	    }
	


