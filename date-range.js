(function ($) {
    "use strict"

    /* function to init date range input box */
    function initDateRange(setting) {
        setting.element.uniqueId();
        setting.id = setting.element.attr("id");
        
        $("body").append(getDateRangePopupTemplate(setting));
        setting.datePopup = $("#date-range-custom-" + setting.id);
        setting.datePopup.data("dateRange", setting);
        attachEvents(setting);
        setting.element.attr("readonly", true);
        setting.datePopup.find(".final-from,.final-to").attr("readonly", true);

    }
    function attachEvents(setting)
    {
        // attach all the option on click event 
        setting.datePopup.find(".m-date-range-today").on("click", function () {
           
            selectToday(getInstance($(this)));
            
        });
        setting.datePopup.find(".m-date-range-yesterday").on("click", function () {

            selectYesterday(getInstance($(this)));

        });
        setting.datePopup.find(".m-date-range-7days").on("click", function () {

            select7Days(getInstance($(this)));

        });
        setting.datePopup.find(".m-date-range-29days").on("click", function () {

            select29Days(getInstance($(this)));

        });
        setting.datePopup.find(".m-date-range-this-month").on("click", function () {

            thisMonth(getInstance($(this)));

        });
        setting.datePopup.find(".m-date-range-last-month").on("click", function () {

            lastMonth(getInstance($(this)));

        });
        setting.datePopup.find(".m-date-range-custom-days").on("click", function () {
            customDateRange(getInstance($(this)));
        });
        setting.element.on("focus",openOnFocus);
        $(document).on("click.cdr" + setting.id, function (e) {
            if ($(e.target).closest("#date-range-custom-" + setting.id).length == 0 && $(e.target).closest("#" + setting.id).length == 0) {
                $("#date-range-custom-" + setting.id).hide();
                setting.element.trigger("dateRange:hidden", { instance: setting });
            }

        });

        setting.datePopup.find(".apply-range").on("click", function () {
            var instance = getInstance($(this));
            applyDateRange(instance);

        });
        setting.datePopup.find(".cancel-range").on("click", function () {
            var instance = getInstance($(this));
            instance.element.trigger("dateRange:cancel", { instance: instance });
            $("#date-range-custom-" + instance.id).hide();
        });


        var todayString = Date.today().clearTime().toString(setting.format);
        //init date picker
        setting.datePopup.find(".from-calender").datepicker({
            format: setting.format,
            endDate: todayString
        }).on('changeDate', function (event) {
            var selectedFromDate = Date.parse(event.date).clearTime();
            setting.from = selectedFromDate.toString(setting.format);
            setting.fromTicks = selectedFromDate.getTime();
          
            if (setting.fromTicks > setting.toTicks) {
                setting.datePopup.find(".to-calender").datepicker("setDate", setting.from);
                setting.to = setting.from;
                setting.toTicks = setting.fromTicks; 
            }
            
            setting.datePopup.find(".to-calender").datepicker('setStartDate', setting.from);
            setting.datePopup.find(".to-calender").datepicker("setDate", setting.to);
            updateInputFields(setting);
            setting.element.trigger("dateRange:dateChanged", { instance: setting, fromCalender: true });
        });
        

        setting.datePopup.find(".to-calender").datepicker({
            format: setting.format,
            endDate: todayString
        }).on('changeDate', function (event) {
            var selectedFromDate = Date.parse(event.date).clearTime();
            setting.to = selectedFromDate.toString(setting.format);
            setting.toTicks = selectedFromDate.getTime();
            updateInputFields(setting);
            setting.element.trigger("dateRange:dateChanged", { instance: setting, fromCalender: true });
        });
        if (setting.selectedFrom != "" && setting.selectedTo != "")
        {
            setting.from =  setting.selectedFrom;
            setting.to = setting.selectedTo;
            setting.toTicks = setting.selectedToTicks;
            setting.fromTicks = setting.selectedFromTicks;
            highlightSelection(setting);
        }
        else
        {
            selectToday(setting,true);
        }
        setting.element.trigger("dateRange:initComplete", { instance: setting });
    }
    function openOnFocus(e)
    {
        var instance = $(this).data("dateRange");
        showDateRangePicker(instance);
    }
   
    function applyDateRange(setting)
    {
        setting.selectedFrom = setting.from;
        setting.selectedFromTicks = setting.fromTicks;
        setting.selectedTo = setting.to;
        setting.selectedToTicks = setting.toTicks;
        setting.element.trigger("dateRange:apply", { instance: setting });
        $("#date-range-custom-" + setting.id).hide();
        setting.element.val(setting.selectedFrom + " to " + setting.selectedTo);
    }

    function showDateRangePicker(setting)
    {
        positionPopup(setting);
        $("#date-range-custom-" + setting.id).show();
        if (setting.selectedFrom != "" && setting.selectedTo != "")
        {
            setting.from = setting.selectedFrom;
            setting.fromTicks = setting.selectedFromTicks;
            setting.to = setting.selectedTo;
            setting.toTicks = setting.selectedToTicks;
            highlightSelection(setting);
        }
        setting.element.trigger("dateRange:render", { instance: setting });

    }
    function showCalenderView(setting) {
        setting.datePopup.find(".calender-container").show();
    }

    function hideCalenderView(setting) {
        setting.datePopup.find(".calender-container").hide();
    }

    function selectToday(setting,init) {
        var today = Date.today().clearTime();
        setting.from = today.toString(setting.format);
        setting.fromTicks = today.getTime();
        setting.to = today.toString(setting.format);
        setting.toTicks = today.getTime();
        setting.selected = ".m-date-range-today";
        highlightSelection(setting);
        hideCalenderView(setting);
        setting.element.trigger("dateRange:dateChanged", { instance: setting, fromCalender: false });

        if(!init)
        {
            applyDateRange(setting);
        }
    }
    function selectYesterday(setting)
    {
        var yesterday = Date.today().clearTime().add(-1).day();
        setting.from = yesterday.toString(setting.format);
        setting.fromTicks = yesterday.getTime();
        setting.to = yesterday.toString(setting.format);
        setting.toTicks = yesterday.getTime();
        setting.selected = ".m-date-range-yesterday";
        highlightSelection(setting);
        hideCalenderView(setting);
        setting.element.trigger("dateRange:dateChanged", { instance: setting, fromCalender: false });
        applyDateRange(setting);

    }
    function select7Days(setting){
        var today = Date.today().clearTime();
        var _7days = Date.today().clearTime().add(-6).day();
        setting.from = _7days.toString(setting.format);
        setting.fromTicks = _7days.getTime();
        setting.to = today.toString(setting.format);
        setting.toTicks = today.getTime();
        setting.selected = ".m-date-range-7days";
        highlightSelection(setting);
        hideCalenderView(setting);
        setting.element.trigger("dateRange:dateChanged", { instance: setting, fromCalender: false });
        applyDateRange(setting);
    }

    function select29Days(setting) {
        
        var today = Date.today().clearTime();
        var _29days = Date.today().clearTime().add(-28).day();
        setting.from = _29days.toString(setting.format);
        setting.fromTicks = _29days.getTime();
        setting.to = today.toString(setting.format);
        setting.toTicks = today.getTime();
        setting.selected = ".m-date-range-29days";
        highlightSelection(setting);
        hideCalenderView(setting);
        setting.element.trigger("dateRange:dateChanged", { instance: setting, fromCalender: false });
        applyDateRange(setting);

    }

    function thisMonth(setting) {

        var firstDay = Date.today().clearTime().moveToFirstDayOfMonth();
        var lastDay = Date.today().clearTime();
        setting.from = firstDay.toString(setting.format);
        setting.fromTicks = firstDay.getTime();
        setting.to = lastDay.toString(setting.format);
        setting.toTicks = lastDay.getTime();
        setting.selected = ".m-date-range-this-month";
        highlightSelection(setting);
        hideCalenderView(setting);
        setting.element.trigger("dateRange:dateChanged", { instance: setting, fromCalender: false });
        applyDateRange(setting);
    }
    function lastMonth(setting) {
        var firstDay = Date.today().clearTime().moveToFirstDayOfMonth().add(-1).month();
        var lastDay = Date.today().clearTime().moveToFirstDayOfMonth().add(-1).month().moveToLastDayOfMonth();
        setting.from = firstDay.toString(setting.format);
        setting.fromTicks = firstDay.getTime();
        setting.to = lastDay.toString(setting.format);
        setting.toTicks = lastDay.getTime();
        setting.selected = ".m-date-range-last-month";
        highlightSelection(setting);
        hideCalenderView(setting);
        setting.element.trigger("dateRange:dateChanged", { instance: setting, fromCalender: false });
        applyDateRange(setting);
    }

    function customDateRange(setting) {
        showCalenderView(setting);
        setting.selected = ".m-date-range-custom-days";
        highlightSelection(setting, true);
    }
    function updateInputFields(setting)
    {
        setting.datePopup.find(".final-from").val(setting.from);
        setting.datePopup.find(".final-to").val(setting.to);
    }
    function highlightSelection(setting,skipDateSetting)
    {
        setting.datePopup.find(".m-range-wrapper li").removeClass("date-selected");
        if (setting.selected != "")
            setting.datePopup.find(setting.selected).addClass("date-selected");
        //update the from and to dates in the ui
        updateInputFields(setting);
        if (!skipDateSetting)
        {
            setting.datePopup.find(".from-calender").datepicker("setDate", setting.from);
            setting.datePopup.find(".to-calender").datepicker("setDate", setting.to);
        }
        
    }
    function getInstance(element)
    {
        var instance = element.closest("[data-cdr]").data("dateRange");
        return instance;
    }


    function positionPopup(setting) {
        var offset = setting.element.offset();
        var elementHeight = setting.element.outerHeight();
        $("#date-range-custom-" + setting.id).css({
            top: offset.top + elementHeight + 10,
            left: offset.left
        });
    }

    function getDateRangePopupTemplate(setting)
    {
        var template = "<div class='m-date-range-wrapper clearfix' data-cdr='" + setting.id + "' id='date-range-custom-" + setting.id + "'>" +
            "<div class='m-date-range-inner-wrapper clearfix'>"+
                "<div class='m-range-wrapper'>" +
                      "<ul>" +
                            "<li class='m-date-range-today'>" +
                                    "<a> Today </a>"+
                            "</li>" +
                            "<li class='m-date-range-yesterday'>" +
                                    "<a> Yesterday </a>" +
                            "</li>" +
                            "<li class='m-date-range-7days'>" +
                                    "<a> Last 7 Days </a>" +
                            "</li>" +
                            "<li class='m-date-range-29days'>" +
                                    "<a> Last 29 Days </a>" +
                            "</li>" +
                            "<li class='m-date-range-this-month'>" +
                                    "<a> This Month </a>" +
                            "</li>" +
                             "<li class='m-date-range-last-month'>" +
                                    "<a> Last Month </a>" +
                            "</li>" +
                             "<li class='m-date-range-custom-days'>" +
                                    "<a> Custom Range </a>" +
                            "</li>" +
                        "</ul>" +
                        "<div>" +
                            "<input type='text' class='final-from'/><span> to </span><input type='text' class='final-to'/>"+
                        "</div>"+
                        "<div class='m-action-btn'>" +
                            "<button type='button' class='btn btn-success apply-range btn-success'>Apply</button>" +
                            "<button type='button' class='btn btn-grey cancel-range'>Cancel</button>" +
                        "</div>"+
                    "</div>" +
                    "<div class='calender-container'>" +
                            "<div class='from-calender'>" +
                            "</div>" +
                            "<div class='to-calender'>" +
                            "</div>" +
                    "</div>"+
                "</div>"+
       "</div>";
       return template;
    }



    $.fn.bootstrapDateRange = function (action, actionValue) {

        if (arguments.length == 0)
        {
            var instance = {
                element: $(this),
                selectedFrom:"",
                selectedFromTicks:"",
                selectedTo:"",
                selectedToTicks: "",
                format: "yyyy-MM-dd"
            }
            $(this).data("dateRange", instance);
            initDateRange(instance);

        }
        else if (arguments.length == 1 && typeof action != "undefined" && action != null)
        {
            if (action != "destroy")
            {
                var options = $.extend(true, {}, {
                    fromDate: "",
                    toDate: "",
                    format: "yyyy-MM-dd"
                }, action);

                if (options.fromDate != "") {
                    options.selectedFromTicks = Date.parse(options.fromDate).getTime();
                }

                if (options.toDate != "") {
                    options.selectedToTicks = Date.parse(options.toDate).getTime();
                }
                if (options.format == null || options.format.trim() == "") {
                    options.format = "yyyy-MM-dd";
                }

                var instance = {
                    element: $(this),
                    selectedFrom: options.fromDate,
                    selectedFromTicks: options.selectedFromTicks,
                    selectedTo: options.toDate,
                    selectedToTicks: options.selectedToTicks,
                    format: options.format
                }
                $(this).data("dateRange", instance);
                initDateRange(instance);
            }
            else
            {
                try
                {
                   var instance =  $(this).data("dateRange");
                   if(typeof instance != "undefined" && instance != null)
                   {
                       $(this).data("dateRange", null);
                       
                       //remove all the events 
                       instance.datePopup.find(".m-date-range-today").off("click");
                       instance.datePopup.find(".m-date-range-yesterday").off("click");
                       instance.datePopup.find(".m-date-range-7days").off("click");
                       instance.datePopup.find(".m-date-range-29days").off("click");
                       instance.datePopup.find(".m-date-range-this-month").off("click");
                       instance.datePopup.find(".m-date-range-last-month").off("click");
                       instance.datePopup.find(".m-date-range-custom-days").off("click");
                       instance.element.off("focus", openOnFocus);
                       $(document).off("click.cdr" + instance.id);

                       instance.datePopup.find(".apply-range").off("click");
                       instance.datePopup.find(".cancel-range").off("click");
                       //make sure the daterange is removed from body before 
                       instance.datePopup.remove();
                   }
                  

                }
                catch(e)
                {
                    console.log("no date picker is initialized");
                }
            }
           

        }
        else if (arguments.length == 2) {


        }
    }
})(jQuery);
