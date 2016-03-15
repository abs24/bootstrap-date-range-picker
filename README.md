# bootstrap-date-range-picker

Dependencies 

1. jQuery 
2. bootstrap 3x 
3. Date js http://www.datejs.com/
4. date picker http://eonasdan.github.io/bootstrap-datetimepicker/


preview url https://plnkr.co/edit/PFN6R1GLwIneZt108JvO?p=preview

basic usage

html 

    <input type="text" id="test"/>

js

    $(document).ready(function(){
      $("#test").bootstrapDateRange();
    });

Parameter initialization

    $(document).ready(function(){
    	$("#test").bootstrapDateRange({
    		fromDate: "",
    		toDate: "",
    		format: "yyyy-MM-dd"
    	});
    });
    
getting value from date range picker

    $("#test").bootstrapDateRange('value');

setting value to date picker 

    $("#test").bootstrapDateRange("setDateRange",{fromDate:"2016-03-14",toDate:"2016-03-14"})
