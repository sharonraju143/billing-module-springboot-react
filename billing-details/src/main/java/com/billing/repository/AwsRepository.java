package com.billing.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.billing.entity.Aws;

@EnableMongoRepositories
public interface AwsRepository extends MongoRepository<Aws, String> {

	// get the data by using months
	List<Aws> findByStartDateBetween(Object startDate, Object currentDate);


	List<Aws> findByServiceAndStartDateGreaterThanEqualAndEndDateLessThanEqual(String service, String startDate,
			String endDate);

	// List<String> findByService();

	@Query(value = "{'service' : {$exists : true}}", fields = "{'service' : 1, '_id':0}")
	List<String> findDistinctByService();

	List<Aws> findByServiceAndStartDateGreaterThanEqual(String service, String startDate);

	List<Aws> findByServiceAndStartDateGreaterThanEqual(String serviceName, Object startDate);

	List<Aws> findByStartDateGreaterThanEqual(Long months);

}
