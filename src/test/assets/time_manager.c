/* 
 * File: time_manager.c
 * Description: This file manages a time variable as a static uint32_t value.
 * It provides functions to set and retrieve the current time.
 */

#include <stdio.h>
static uint32_t lastStoredTime;

/**
 * Sets the current time.
 * @param currentTime The current time to be stored.
 */
void setTime(uint32_t currentTime) {
  // Store received value in store
  // and return nothing
  lastStoredTime = currentTime;
}

/**
 * Retrieves the stored current time.
 * @return The stored current time.
 */
uint32_t getTime() {
  // Retrieve value from static stored value
  // and return the value
  return lastStoredTime;
}
