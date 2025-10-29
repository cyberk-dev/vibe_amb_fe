/**
 * Vitest Global Setup
 *
 * This file runs before all tests to configure the test environment.
 * Setting TZ to UTC ensures consistent date/time behavior across different
 * development environments regardless of the system's local timezone.
 */

// Set timezone to UTC (UTC+0) for all tests
process.env.TZ = "UTC";
