odoo.define('boom_hr_recruitment.custom', function (require) {
    'use strict';

    //alert("dfgdfg");
    function readFile(file, callback) {
        alert("file reader")
        var reader = new FileReader();
        reader.onload = callback
        reader.readAsText(file);
    }

    function ValidationFormView(){
        var proceed = true
        $(".mobile").blur(function (e) {
                var value = $(this).val();
                if (value.length < 10) {
                    alert("Please enter email ");
                    proceed =false
                }
            });

        return proceed;

    }

    $("form.applicant_view :input").attr("autocomplete", "off");
    $(function () {
        $(".datepicker").datepicker({
            dateFormat: "yy-mm-dd",
            maxDate: -1,
            changeMonth: true,
            changeYear: true,
            yearRange: '-20:+0' //year range -20 from current year: current year
        });
    });
    $(document).ready(function () {
            $(".only-num").keypress(function (e) {
                // alert("djfghdfgd")
                if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                    return false;
                }
            });



            $("input[name$='applicant_type']").click(function () {
                var value = $(this).val();
                if (value == "fresher") {
                    $(".employement_details_view").addClass("hide");
                    $('.applicant_view').find('tr.experience_details_row').find(':text').removeAttr("required", "1");
                    $('.applicant_view').find('tr.experience_details_row').find(':selected').removeAttr("required", "1");
                } else {
                    $(".employement_details_view").removeClass("hide");
                    $('.applicant_view').find('tr.experience_details_row').find(':text').attr("required", "1");
                    $('.applicant_view').find('tr.experience_details_row').find(':selected').attr("required", "1");
                }
            });

            $("input[class$='dynamic_checkbox']").click(function () {
                var value = $(this).val();
                var is_checked = $(this).prop("checked");
                var name = $(this).attr("name");
                if (is_checked) {
                    if (name == "is_attend_already") {
                        $('.is_attend_alreadydiv').removeClass("hide");
                        $('.is_attend_alreadydiv').find(':text').attr("required", "1");
                    }
                    if (name == "member_known_incmpy") {

                        $('.employee_inthree').removeClass("hide");
                        $('.employee_inthree').find(':text').removeAttr("required");
                    }
                    $(this).val("on");
                } else {
                    if (name == "is_attend_already") {
                        $('.is_attend_alreadydiv').addClass("hide");
                        $('.is_attend_alreadydiv').find(':text').attr("required", "1");
                    }
                    if (name == "member_known_incmpy") {

                        $('.employee_inthree').addClass("hide");
                        $('.employee_inthree').find(':text').removeAttr("required");
                    }
                    $(this).val("off");
                }
            });

            var is_proceed = true;

            $('.applicant_view  input[required="1"]').each(function () {
                var value = $(this).val();
                if (value.length == 0) {
                    is_proceed = false;

                }
            });

            $('.add-exp-span').click(function () {
                var $tr = $(this).closest('.experience_details_row');
                var s = $('.employement_details_view').find('tr').length;
                var rowCount = $('#employement_details_view tr').length;
                var $clone = $tr.clone();
                $clone.find(':text').val('');
                $clone.find(".fa-plus").addClass("hide");
                $clone.find(".fa-trash").removeClass("hide");
                $clone.find(':text').each(function () {
                    var attr_name = $(this).attr("col") + rowCount
                    $(this).attr("name", attr_name + '')
                });
                $('.applicant_view').find('.experience_details_row').last().after($clone);
            });

            $('.add-fam-span').click(function () {
                var $tr = $(this).closest('.family_details_row');
                var rowCount = $('#family_details_view tr').length;
                var $clone = $tr.clone();
                $clone.find(':text').val('');
                $clone.find(".fa-plus").addClass("hide");
                $clone.find(".fa-trash").removeClass("hide");
                $clone.find(':text').each(function () {
                    var attr_name = $(this).attr("col") + rowCount
                    $(this).attr("name", attr_name + '')
                });
                $('.applicant_view').find('.family_details_row').last().after($clone);
            });

            $('.add-doc-span').click(function () {
                var $tr = $(this).closest('.documents_details_row');
                var rowCount = $('#documents_details_view tr').length;
                var $clone = $tr.clone();
                $clone.find(':text').val('');
                $clone.find('.file').val('');
                $clone.find(".fa-plus").addClass("hide");
                $clone.find(".fa-trash").removeClass("hide");
                $clone.find(':text').each(function () {
                    var attr_name = $(this).attr("col") + rowCount
                    $(this).attr("name", attr_name + '')
                });
                $('.applicant_view').find('.documents_details_row').last().after($clone);
            });


            $('.add-edu-span').click(function () {
                var $tr = $(this).closest('.education_details_row');
                var s = $('.education_details_view').find('tr').length;
                var rowCount = $('#education_details_view tr').length;
                var $clone = $tr.clone();
                $clone.find(':text').val('');
                $clone.find(".fa-plus").addClass("hide");
                $clone.find(".fa-trash").removeClass("hide");
                // .removeClass("hide");
                $clone.find(':text').each(function () {
                    var attr_name = $(this).attr("col") + rowCount
                    $(this).attr("name", attr_name + '')
                });
                $('.applicant_view').find('.education_details_row').last().after($clone);
            });


            $(".applicant_view").on("click", ".delete_action", function (e) {
                $(this).closest('tr').remove();

            });

            $(".only-char").keypress(function (event) {
                var inputValue = event.which;
                // allow letters and whitespaces only.
                if (!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)) {
                    event.preventDefault();
                }
            });

            $(".applicant_view").on("change", ".source_from", function (e) {
                alert("gfg");
                var selected_value = $(this).val();
                if (selected_value == "referral") {
                    $(".applicant_view").find(".emp_referral_div").removeClass("hide")
                    $(".applicant_view").find(".emp_referral_div").find(':text').val()
                    $(".applicant_view").find(".emp_referral_div").find(':text').attr("required", "1")

                } else {
                    $(".applicant_view").find(".emp_referral_div").addClass("hide")
                }

            });

            $(".applicant_view").on("change", ".file", function (e) {

                var $file_data = $(this).closest('tr').find('#file_data');
                var $file_name = $(this).closest('tr').find('#file_name');
                var $file_type = $(this).closest('tr').find('#file_type');
                var file_type = this.files[0]['type']
                var file_name = this.files[0]['name']
                $file_name.val(file_name);
                $file_type.val(file_type);
                readFile(this.files[0], function (e) {
                    $file_data.val(e.target.result);

                });


            });
            $(".applicant_view").on("click", ".action_submit_button", function (e) {
                var is_proceed = true;
                $('.applicant_view  input[required="1"]').each(function () {
                    var value = $(this).val();
                    if (value.length == 0) {
                        is_proceed = false;
                    }
                });

                ValidationFormView();
                if (is_proceed) {
                    var experience_ids = [];

                    // while click submit action save th.e school_history_records
                    $('.applicant_view').find('tr.experience_details_row').each(function () {
                        var values = {
                            'company_name': $(this).find("#company_name").val(),
                            'position': $(this).find("#position").val(),
                            'salary': $(this).find("#salary").val(),
                            'employed_from_month': $(this).find("#employed_from_month").val(),
                            'employed_from_year': $(this).find("#employed_from_year").val(),
                            'employed_to_month': $(this).find("#employed_to_month").val(),
                            'employed_to_year': $(this).find("#employed_to_year").val(),
                            'employeer_name': $(this).find("#employeer_name").val(),
                            'emp_mobile': $(this).find("#emp_mobile").val()

                        };

                        experience_ids.push(values);
                    });
                    $('.applicant_view').find('#experience_datas').val(JSON.stringify(experience_ids))
                    var family_details_ids = [];
                    // while click submit action save the school_history_records
                    $('.applicant_view').find('tr.family_details_row').each(function () {
                        alert("inner");
                        var values = {
                            'company': $(this).find("#company").val(),
                            'name': $(this).find("#name").val(),
                            'relation': $(this).find("#relation").val(),

                        };

                        family_details_ids.push(values);
                    });

                    $('.applicant_view').find('#family_datas').val(JSON.stringify(family_details_ids));

                    var documents_details_ids = [];
                    // while click submit action save the school_history_records
                    $('.applicant_view').find('tr.documents_details_row').each(function () {
                        var values = {
                            'file_data': $(this).find("#file_data").val(),
                            'file_type': $(this).find("#file_type").val(),
                            'file_name': $(this).find("#file_name").val(),

                        };

                        documents_details_ids.push(values);
                    });


                    $('.applicant_view').find('#documents_datas').val(JSON.stringify(documents_details_ids))

                    var education_ids = [];
                    // while click submit action save the school_history_records
                    $('.applicant_view').find('tr.education_details_row').each(function () {
                        var values = {
                            'qualification': $(this).find("#qualification").val(),
                            'college_name': $(this).find("#college_name").val(),
                            'mode_of_education': $(this).find("#mode_of_education:checked").val(),
                            'period_from_month': $(this).find("#period_from_month").val(),
                            'period_from_year': $(this).find("#period_from_year").val(),
                            'period_to_month': $(this).find("#period_to_month").val(),
                            'period_to_year': $(this).find("#period_to_year").val(),
                            'percentage_mark': $(this).find("#percentage_mark").val(),
                            // 'emp_mobile': $(this).find("#emp_mobile").val()

                        };

                        education_ids.push(values);
                    });
                    $('.applicant_view').find('#education_datas').val(JSON.stringify(education_ids));

                    console.log("submit actiomn")
                    $('.applicant_view').submit();
                }


            });


        }
    );
    return {};
});
