/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

eval("$(function () {\r\n\r\n    // console.log('works');\r\n    var urlCity = 'http://localhost:3000/city'\r\n\r\n    let loadCity = () =>{\r\n        $.ajax({\r\n            url: urlCity,\r\n            method: 'GET',\r\n            dataType: 'json'\r\n        }).done(function (response) {\r\n            console.log(response);\r\n\r\n            response.forEach(function (val) {\r\n                console.log(val.name);\r\n            })\r\n\r\n        }).fail(function (msg) {\r\n            console.log(msg);\r\n        })\r\n    }\r\n\r\n    //TEST\r\n    loadCity();\r\n\r\n\r\n    //event handler for when the user chooses city from a drop-down:\r\n    // $('#city').change(function (e) {\r\n    // $('#city').on('change', function (e) {\r\n    //     // console.log('works');\r\n    //     //display 'search for attractions' after the user chooses city:\r\n    //     $('.search').css('display', 'block');\r\n    //\r\n    // });\r\n\r\n\r\n\r\n})//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvYXBwLmpzPzcxYjQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQSxhQUFhOztBQUViLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7Ozs7QUFJUixDQUFDIiwiZmlsZSI6IjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnd29ya3MnKTtcclxuICAgIHZhciB1cmxDaXR5ID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9jaXR5J1xyXG5cclxuICAgIGxldCBsb2FkQ2l0eSA9ICgpID0+e1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdXJsQ2l0eSxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codmFsLm5hbWUpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vVEVTVFxyXG4gICAgbG9hZENpdHkoKTtcclxuXHJcblxyXG4gICAgLy9ldmVudCBoYW5kbGVyIGZvciB3aGVuIHRoZSB1c2VyIGNob29zZXMgY2l0eSBmcm9tIGEgZHJvcC1kb3duOlxyXG4gICAgLy8gJCgnI2NpdHknKS5jaGFuZ2UoZnVuY3Rpb24gKGUpIHtcclxuICAgIC8vICQoJyNjaXR5Jykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJ3dvcmtzJyk7XHJcbiAgICAvLyAgICAgLy9kaXNwbGF5ICdzZWFyY2ggZm9yIGF0dHJhY3Rpb25zJyBhZnRlciB0aGUgdXNlciBjaG9vc2VzIGNpdHk6XHJcbiAgICAvLyAgICAgJCgnLnNlYXJjaCcpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgLy9cclxuICAgIC8vIH0pO1xyXG5cclxuXHJcblxyXG59KVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL2FwcC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n");

/***/ })
/******/ ]);