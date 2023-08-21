/**
 * Rulechain Architecture
 * 
 * > Generator node from AN Airport
 * > rest http GET node to flights API to fetch scheduled flights of THE Airport
 * > split array node to serialize the big fetch into individual fligths JSON
 * > filter node to only keep the schedules inside a timeframe
 * >
 * 
 */