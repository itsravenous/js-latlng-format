/**
 * @file latlng-formatter.js
 * @author @itsravenous
 * 
 * Provides helpers to convert latitude/longitude ordinates between decimal, DMS and GPS formats
 */
(function () {
	var LatLngFormatter = {

		/**
		 * Converts a decimal ordinate to DMS
		 * @param {number} decimal ordinate
		 * @param {string} type of ordinate (lat or long)
		 * @return {mixed} an object containing the converted degrees, minutes and seconds, or false if input was invalid
		 */
		decimalToDMS: function (ord, type) {
			if (LatLngFormatter.validateDecimal(ord, type)) {
				if (ord % 1 === 0) {
					return {
						degrees: ord,
						minutes: 0,
						seconds: 0
					};
				} else {
					degrees = Math.floor(ord);
					resultminutes = 60.0 * (ord - degrees);
					minutes  = 1.0 * Math.floor(resultminutes);
					seconds = Math.round(60.0 * (resultminutes - minutes), 3);4

					return {
						degrees: degrees,
						minutes: minutes,
						seconds: seconds
					};
				}
			} else {
				return false;
			}
		},

		/**
		 * Converts a decimal ordinate to GPS
		 * @param {number} decimal ordinate
		 * @param {string} type of ordinate (lat or long)
		 * @return {mixed} an object containing the converted degrees and minutes, or false if input was invalid
		 */
		decimalToGPS: function (ord, type) {
			if (LatLngFormatter.validateDecimal(ord, type)) {
				if (ord % 1 === 0) {
					return {
						degrees: ord,
						minutes: 0
					};
				} else {
					// Convert to DMS first
					var dmsOrd = LatLngFormatter.decimalToDMS(ord, type);
					return LatLngFormatter.DMSToGPS(dmsOrd);
				}
			} else {
				return false;
			}
		},
		
		/**
		 * Converts a DMS ordinate to decimal
		 * @param {object} ordinate containing degrees, minutes and seconds values
		 * @param {string} type of ordinate (lat or long)
		 * @return {mixed} the decimal ordinate, or false if input was invalid
		 */
		DMSToDecimal: function (ord, type) {
			if (LatLngFormatter.validateDMS(ord, type)) {
				degrees = ord.degrees;
				var sign = (degrees < 0) ? -1: 1;
				minutes = ord.minutes * sign; 
				seconds = ord.seconds * sign;

				dec = parseInt(degrees) + (minutes / 60) + (seconds / 3600);
				return dec;
			} else {
				return false;
			}
		},

		/**
		 * Converts a DMS ordinate to GPS
		 * @param {object} ordinate containing degrees, minutes and seconds values
		 * @param {string} type of ordinate (lat or long)
		 * @return {mixed} an object containing the minutes and seconds, or false if input was invalid
		 */
		DMSToGPS: function (ord, type) {
			if (LatLngFormatter.validateDMS(ord, type)) {
				minutes = ord.minutes + ord.seconds / 60; 

				return {
					degrees: ord.degrees,
					minutes: minutes
				};
			} else {
				return false;
			}
		},

		/**
		 * Converts a GPS ordinate to decimal
		 * @param {array} ordinate containing degrees and minutes
		 * @param {string} type of ordinate (lat or long)
		 * @return {mixed} the decimal ordinate, or false if input was invalid
		 */
		GPSToDecimal: function (ord, type) {
			if (LatLngFormatter.validateGPS(ord, type)) {
				dmsOrd = LatLngFormatter.GPSToDMS(ord, type);
				return LatLngFormatter.DMSToDecimal(dmsOrd);
			} else {
				return false;
			}
		},

		/**
		 * Converts a GPS ordinate to DMS
		 * @param {array} ordinate containing degrees and minutes
		 * @param {string} type of ordinate (lat or long)
		 * @return {mixed} the decimal ordinate, or false if input was invalid
		 */
		 GPSToDMS: function (ord, type) {
			if (LatLngFormatter.validateGPS(ord, type)) {
				var degrees = ord.degrees;
				var minutesInt = Math.floor(ord.minutes);
				var seconds = (ord.minutes - minutesInt) * 60;

				return {
					degrees: degrees,
					minutes: minutesInt,
					seconds: seconds
				};
			} else {
				return false;
			}
		},

		/**
		 * Validates a DMS ordinate
		 * @param {number} decimal ordinate
		 * @param {string} type of ordinate (lat or long)
		 * @return {bool}
		 */
		validateDecimal: function (ord, type) {
			if (typeof ord != undefined) {
				var degMax = type == 'lat' ? 90 : 180;
				var degMin = -1 * degMax;

				return (ord >= degMin && ord <= degMax);
			} else {
				return false;
			}
		},

		/**
		 * Validates a DMS ordinate
		 * @param {object} ordinate containing degrees, minutes and seconds values
		 * @param {string} type of ordinate (lat or long)
		 * @return {bool}
		 */
		validateDMS: function (ord, type) {
			if (ord.degrees && ord.minutes && ord.seconds ) {
				var degMax = type == 'lat' ? 90 : 180;
				var degMin = -1 * degMax;

				return (ord.degrees >= degMin && ord.degrees <= degMax && ord.minutes <= 60 && ord.seconds <= 60);
			} else {
				return false;
			}
		},

		/**
		 * Validates a GPS ordinate
		 * @param {object} ordinate containing degrees and minutes
		 * @param {string} type of ordinate (lat or long)
		 * @return {bool}
		 */
		validateGPS: function (ord, type) {
			if (ord.degrees && ord.minutes ) {
				var degMax = type == 'lat' ? 90 : 180;
				var degMin = -1 * degMax;

				return (ord.degrees >= degMin && ord.degrees <= degMax && ord.minutes <= 60);
			} else {
				return false;
			}
		}

	}

	// Expose AMD module if necessary, otherwise attach to global
	var inCommon = typeof module !== 'undefined' && module.exports;
	var inRequire = typeof define === "function" && define.amd;

	if (inCommon) {
	    module.exports = LatLngFormatter;
	} else if (inRequire) {
		define('LatLngFormatter', [], function () {
			return LatLngFormatter;
		});
	} else {
		this.LatLngFormatter = LatLngFormatter;
	}
})(this);