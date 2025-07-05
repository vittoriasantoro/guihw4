/*
   File: script.js
   GUI Assignment: HW4
   Description: Multiplication Table Website with JQuery
   Vittoria Santoro, UMass Lowell Computer Science, vittoria_santoro@student.uml.edu
   Copyright (c) 2025 by Santoro. All rights reserved. May be freely copied or
   excerpted for educational purposes with credit to the author.
 */

$(document).ready(function () {
    // pair sliders with number inputs
    sliderElement("#minCol", "#minColSlider");
    sliderElement("#maxCol", "#maxColSlider");
    sliderElement("#minRow", "#minRowSlider");
    sliderElement("#maxRow", "#maxRowSlider");
    // make sure min is always less than or equal to max for both rows and columns
    $.validator.addMethod("validateMinMax", function(value, element, minSelector) {
        console.log(value)
        console.log(Number($(minSelector).val()))
        return Number(value) >= Number($(minSelector).val());
    })
    // make sure the range does not exceed 100
    $.validator.addMethod("validateRange", function(value, element, minSelector) {
        return (Number(value) - Number($(minSelector).val())) <= 100;
    })
    $("#tableForm").validate({
        rules: {
            minCol: {
                required: true,
                number: true,
            },
            maxCol: {
                required: true,
                number: true,
                validateMinMax: "#minCol",
                validateRange: "#minCol"
            },
            minRow: {
                required: true,
                number: true,
            },
            maxRow: {
                required: true,
                number: true,
                validateMinMax: "#minRow",
                validateRange: "#maxRow"
            }
        },
        messages: {
            minCol: "Please enter a valid Integer",
            maxCol: {
                required: "Please enter a valid Integer",
                number: "Please enter a valid Integer",
                validateMinMax: "Max Column must be greater than Min Column",
                validateRange: "The given width is too large. Please input a smaller range (maximum 100)",
            },
            minRow: "Please enter a valid Integer",
            maxRow: {
                required: "Please enter a valid Integer",
                number: "Please enter a valid Integer",
                validateMinMax: "Max Row must be greater than Min Row",
                validateRange: "The given height is too large. Please input a smaller range (maximum 100)",
            }
        },
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        },
        // create a new tab only on submit
        submitHandler: function(form) {
            createNewTab()
        },
    })
});

function buildTable() {
    const minCol = Number($("#minCol").val());
    const maxCol = Number($("#maxCol").val());
    const minRow = Number($("#minRow").val());
    const maxRow = Number($("#maxRow").val());
    let tableHTML = "<table><tr><th></th>"
    for (let k = minCol; k <= maxCol; k++)
    {
        tableHTML += `<th>${k}</th>`
    }
    tableHTML += "</tr>"
    for (let i = minRow; i <= maxRow; i++)
    {
        // the first element of each row should be a table header (row header)
        tableHTML += `<tr><th>${i}</th>`
        for (let j = minCol; j <= maxCol; j++)
        {
            tableHTML += `<td>${i * j}</td>`
        }
        tableHTML += "</tr>"
    }
    tableHTML += "</table>";
    console.log(tableHTML)
    return tableHTML;
}

function createNewTab() {
    // creates a new tab of unique ID based on current form inputs.
    const minCol = $("#minCol").val();
    const maxCol = $("#maxCol").val();
    const minRow = $("#minRow").val();
    const maxRow = $("#maxRow").val();
    const tableHTML = buildTable();
    const $tabs = $("#tabs")
    if (!$tabs.data("ui-tabs")) {
        $tabs.tabs().show();
    }

    const newLabel = `[${minCol}, ${maxCol}]X[${minRow}, ${maxRow}]`
    const uniqueID = `tab-${Date.now()}`
    const $ul = $tabs.find("ul")

    $ul.append(`<li><a href="#${uniqueID}">${newLabel}</a><span class ="ui-icon ui-icon-close" role="presentation"></span></li>`)
    $tabs.append(`<div id="${uniqueID}">${tableHTML}</div>`).tabs("refresh").tabs("option", "active", -1)
}

function generateTempTab() {
    // generate a temporary table tab, specifically for testing out dynamic sliders
    const tableHTML = buildTable();
    const $tabs = $("#tabs")
    if (!$tabs.data("ui-tabs")) {
        $tabs.tabs().show();
    }
    const newLabel = `[TEMP TAB]`
    const uniqueID = `temp-tab`
    const $ul = $tabs.find("ul")

    $ul.append(`<li><a href="#${uniqueID}">${newLabel}</a><span class ="ui-icon ui-icon-close" role="presentation"></span></li>`)
    // make temp tab the active tab
    $tabs.append(`<div id="${uniqueID}">${tableHTML}</div>`).tabs("refresh").tabs("option", "active", -1)
}

function sliderElement(inputSel, sliderSel) {
    // matches the sliding elements with input element
    $(sliderSel).slider({
        min: -100,
        max: 100,
        step: 1,
        slide: function(event, ui) {
            $(inputSel).val(ui.value);
            $(inputSel).trigger("inputChanged");
        }
    });
    $(inputSel).val($(sliderSel).slider("value"));
    // update slider when key changes
    $(inputSel).on("keyup", function() {
        const v = parseInt($(inputSel).val());
        if(isNaN(v)) $(sliderSel).slider("value", v);
        $(inputSel).trigger("inputChanged");
    });
    // update slider when key changes
    $(inputSel).on("keydown", function() {
        const v = parseInt($(inputSel).val());
        if(isNaN(v)) $(sliderSel).slider("value", v);
        $(inputSel).trigger("inputChanged");
    });
}

$("#minCol, #maxCol, #minRow, #maxRow").on("inputChanged", function () {
    // update temp-tab when slider changes
    const $tabs = $("#tabs")
    if ($("#tableForm").valid() && $tabs.data("ui-tabs")) {
        if (!$("#temp-tab").length) {
            generateTempTab();
        }
        else {
            $("#temp-tab").html( buildTable() )
        }
    }
    else{
        if ($("#temp-tab").length > 0) {
            $("#temp-tab").html("")
        }
    }
});

$("#tabs").on("click", ".ui-icon-close", function () {
    // delete tabs when ui-icon-close is clicked
    const $li = $(this).closest("li");
    const panelID = $li.attr("aria-controls");
    $li.remove();
    $("#" + panelID).remove();
    $("#tabs").tabs("refresh");
});

$("#clear").on("click", function () {
    $("#tabs ul").empty();
    $("#tabs > .ui-tabs-panel").remove();
    // $("#tabs").hide();
    $("#temp-tab").remove();
})