odoo.define('pappaya_admission.web_responsive', function(require) {
    'use strict';
    var ajax = require('web.ajax');
    //Date picker
    $(function() {
        $(".datepicker").datepicker({
            dateFormat: "yy-mm-dd",
            maxDate: -1,
            changeMonth: true,
            changeYear: true,
            yearRange: '-20:+0' //year range -20 from current year: current year
        });
    });
    $(function() {
        $(".datepicker1").datepicker({
            dateFormat: "yy-mm-dd",
            changeMonth: true,
            changeYear: true,
            yearRange: '-50:+50'
        });
    });
    $(window).load(function() {
        $('select option').each(function() {
            if ($(this).is(':selected') && $(this).filter(':selected').text() != "") {
                $(this).closest('.selector').find('label.form-control').addClass('ph-floating');
            }
        });
       /* if (window.location.href.indexOf("state") == -1) {
            window.localStorage.clear();
        }*/

    });
    $(document).ready(function() {
        //Remove append fields in school history
        var img = new Image();
        img.src = localStorage.theImage;
        $('.imagearea').html(img);
        $("body").on("change", ".file_upload", function(e) {
            var fileName = e.target.files[0].name;
            $('span.filename').text(fileName);
            var fileInput = $(this)[0];
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.src = reader.result;
                localStorage.theImage = reader.result;
                $(".imagearea").html(img);
            }
            reader.readAsDataURL(file);
        });

        $('select').on('change', function() {
            var opt = $(this).filter(':selected').text();
            if (opt != "") {
                $(this).closest('.selector').find('label.form-control').addClass('ph-floating');
            } else {
                $(this).closest('.selector').find('label.form-control').removeClass('ph-floating');
            }
        });

        //parent sign get from local storage
        var prSign = localStorage.getItem("parentSign");
        if (prSign != "") {
            $('.signature_img').show();
            $('.signature_img').attr('src', 'data:image/jpeg;base64,' + prSign);
            $(".booking-form #parent_signature").val(prSign);
        } else {
            $('.signature_img').hide()
        }
        // read uploaded file from localstorage
        var fileuploadname = localStorage.getItem("fileuploadname");
        $('.filename').text(fileuploadname);
        $('.booking-form #file_data').val(localStorage.getItem("fileuploadvalue"));
        $('.booking-form #file_name').val(fileuploadname);
        $('.booking-form #file_type').val(localStorage.getItem("file_type"));
        $('.booking-form .school_history_datas').val(localStorage.getItem("school_history_datas"));
        $('.booking-form .parent_details_datas').val(localStorage.getItem("parent_details_datas"));

        // click on payment button, wiill auto submit the 3rd party payment gateway.
        var location_address = window.location.href;
        if (location_address.indexOf('website/payumoney/') > -1) {
            $('#payumoney_templates_form').submit();
        }
        if (location_address.indexOf('/hdfc_payment/pay') > -1) {
            $('#hdfc_templates_form').submit();
            $('.auto-save').savy('load');
        }

        //Local storage
        /* $('.auto-save').savy('load'); */

        console.log(window.location.href.indexOf("state"));
        /*if (window.location.href.indexOf("state") == -1) {
            $('.auto-save').savy('destroy');
        } else {
            $('.auto-save').savy('load');
            var submit_action = $('.booking-form .submit-action').text();
            if (submit_action != '') {
                var data = $(".booking-form").serializeArray();
                $('.booking-form').submit();
                $('.auto-save').savy('destroy');
                 window.localStorage.clear();
            }
        }*/
        //Number validation
        $('.num_valid').keypress(function(e) {
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                $(this).next(".errmsg").html("Please enter only numbers").show().fadeOut(2000);
                return false;
            }
        });
       // Restrict the enter special characters
       $('.allow_character').keypress(function (event) {
           var regex = new RegExp("^[a-zA-Z0-9]+$");
           var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
           if (!regex.test(key)) {
              event.preventDefault();
              return false;
           }
       });

		$('.file').on('change', function(){ 
			var education_history_line_ids = [];
			var exp_history_line_ids = [];
            // while click submit action save the school_history_records
			$('.booking-form').find('div .pupil_details').each(function() {
                var edu_values = {
                    'date_from': $(this).find(".date_from").val(),
                    'date_to': $(this).find(".date_to").val(),
                    'degree': $(this).find(".degree").val(),
                    'major': $(this).find(".major").val(),
                    'university': $(this).find(".university").val(),
                    'gpa': $(this).find(".gpa").val(),
					'is_present': $(this).find('input[name="is_present"]:checked').val(),
                };                
				
				education_history_line_ids.push(edu_values);
            });
			$('.booking-form').find('div .exp_details').each(function() {
			var exp_values = {
                    'exp_date_from': $(this).find(".exp_date_from").val(),
                    'exp_date_to': $(this).find(".exp_date_to").val(),
                    'job_title': $(this).find(".job_title").val(),
                    'company': $(this).find(".company").val(),
					'is_present': $(this).find('input[name="is_present"]:checked').val(),
                };     
				exp_history_line_ids.push(exp_values);
			});
            console.log(education_history_line_ids, ">>>>>>>>>>>>>>>>>>>>");
			console.log(exp_history_line_ids, ">>>>>>>>>>>>>>>>>>>>");
            $('.edu_details_datas').val(JSON.stringify(education_history_line_ids));
            localStorage.setItem("edu_details_datas", JSON.stringify(education_history_line_ids));
			$('.exp_details_datas').val(JSON.stringify(exp_history_line_ids));
            localStorage.setItem("exp_details_datas", JSON.stringify(exp_history_line_ids));
		});
		
        // file upload functionality - Added by Felix
       $('.job_id').on('change', function(e) {
            var attachment = document.querySelector('#files1').files[0];
            var reader = new FileReader();
            reader.onload = function() {
                var dataURL = reader.result;
                $('.booking-form').find('#file_data').val(dataURL);
                $('.booking-form').find('#file_type').val(attachment.type)
                $('.booking-form').find('#file_name').val(attachment.name)
            }
            if (attachment != undefined)
                reader.readAsDataURL(attachment);

			var attachment = document.querySelector('.files1').files[0];
            var reader = new FileReader();
            reader.onload = function() {
                var dataURL = reader.result;
                $('.booking-form').find('#file_data1').val(dataURL);
                $('.booking-form').find('#file_type1').val(attachment.type)
                $('.booking-form').find('#file_name1').val(attachment.name)
            }
            if (attachment != undefined)
                reader.readAsDataURL(attachment);
        });
        // End

        // email validation
        $('.booking-form #parent_email').blur(function(e) {
            var value = $('.booking-form #parent_email').val();
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(value) == false)
            {
                $('.booking-form #parent_email').next(".errmsg").html("Please enter valid email").show().fadeOut(2000);
            }
            return true;
        });



		$('.job_id').on('change', function(e) {
            var fileName = e.target.files[0].name;
            $('#files1').text(fileName);
            var fileInput = $(this)[0];
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.src = reader.result;
                localStorage.theImage = reader.result;
                var fileuploadname = localStorage.getItem("fileuploadname");
            }
            reader.readAsDataURL(file);
        });

		
		$(".edu_details_body").on('click', '.remove_applicant_details', function(e) {
            var count = $('.pupil_details').children().length;
            e.currentTarget.parentNode.remove();
        });

        // Added school_history on click add
        $('.add_employment_details').on("click", function(e) {
            $('.edu_details_body').append(
	"<div class='pupil_details'><div href='javascript:void(0)' id='remove_applicant_details' class='remove_applicant_details'>\
                    <img src='/inherit_hr_recruitment/static/src/img/discard.png'\
                        width='24'/>\
</div><div class=''>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='date' name='date_from' required='1'\
						class='form-control date_from o_website_form_input datepicker auto-save floating-input'\
					 placeholder='' />\
					<label class='form-control' for='date_from'>Date from\
					</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='date' name='date_to' required='1'\
						class='form-control date_to o_website_form_input datepicker auto-save floating-input'\
						 placeholder='' />\
					<label class='form-control' for='date_to'>Date to\
					</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='text' name='degree' required='1'\
						class='form-control degree o_website_form_input floating-input'\
						placeholder='' />\
					<label class='form-control' for='degree'>Degree\
					</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='text' name='major' required='1'\
						class='form-control major o_website_form_input floating-input'\
						placeholder='' />\
					<label class='form-control' for='major'>Major\
					</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='text' name='university' required='1'\
						class='form-control university o_website_form_input floating-input'\
						placeholder='' />\
					<label class='form-control' for='university'>University\
					</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='text' name='gpa' required='1'\
						class='form-control gpa o_website_form_input floating-input''\
						placeholder= ''/>\
					<label class='form-control' for='gpa''>GPA\
					</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='checkbox' name='is_present'\
						class='check_first_time is_present' id='is_present'\
						placeholder='' />\
					<label class='form-control' for='is_present'>Is Present</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
				</div>\
			</div>\
		</div></div>");
            
        });

	$(".exp_details_body").on('click', '.remove_expt_details', function(e) {
            var count = $('.pupil_details').children().length;
            e.currentTarget.parentNode.remove();
        });

	$('.add_experience_details').on("click", function(e) {
            $('.exp_details_body').append(
	"<div class='exp_details'><div href='javascript:void(0)' id='remove_expt_details' class='remove_expt_details'>\
                    <right><img src='/inherit_hr_recruitment/static/src/img/discard.png'\
                        width='24'/></div>\
               \<div class=''>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='date' name='exp_date_from' required='1'\
						class='form-control exp_date_from o_website_form_input datepicker auto-save floating-input'\
					 placeholder='' />\
					<label class='form-control' for='exp_date_from'>Date from\
					</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='date' name='exp_date_to' required='1'\
						class='form-control exp_date_to o_website_form_input datepicker auto-save floating-input'\
						 placeholder='' />\
					<label class='form-control' for='exp_date_to'>Date to\
					</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='text' name='job_title' required='1'\
						class='form-control job_title o_website_form_input floating-input'\
						placeholder='' />\
					<label class='form-control' for='job_title'>Job Title\
					</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='text' name='company' required='1'\
						class='form-control company o_website_form_input floating-input'\
						placeholder='' />\
					<label class='form-control' for='company'>Company\
					</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
					<input type='checkbox' name='is_present'\
						class='check_first_time is_present' id='is_exp_present'\
						placeholder='' />\
					<label class='form-control' for='is_exp_present'>Is Present</label>\
				</div>\
			</div>\
			<div class='form-group col-lg-4'>\
				<div class='col-md-6 floating-label'>\
				</div>\
			</div>\
		</div></div>");
            
        });
		$('.is_experienced').on("click", function(e) {
			var is_experienced = $('input[name="is_experienced"]:checked').val();
            if (is_experienced == 'True'){
            	$(".exp_details_div").removeClass("d-none").addClass('d-displ');
                
            } else{
            	$(".exp_details_div").removeClass("d-displ").addClass('d-none');
            }
        });
		$('.file').blur(function(e) {
            var attachment = document.querySelector('.files1').files[0];
            var reader = new FileReader();
            reader.onload = function() {
                var dataURL = reader.result;
                $('.booking-form').find('#file_data').val(dataURL);
                $('.booking-form').find('#file_type').val(attachment.type)
                $('.booking-form').find('#file_name').val(attachment.name)
            }
            if (attachment != undefined)
                reader.readAsDataURL(attachment);
        });

        // remove the school history div
        $('.booking-form #school_history_rows_ids').on("click", ".remove_school_history", function(e) {
            var count = $('.booking-form #school_history_rows_ids').children().length;
            if (count > 2)
                e.currentTarget.parentNode.remove();
        });
        // Added parent history on click add
        $('.booking-form #parent_details_row_ids').on("click", ".add_parent_details", function(e) {
            var rows = $('.booking-form #parent_details_row_ids div.parent_details_rows:first').clone();
            rows.find('input ').each(function() {
                $(this).val('');
            });
            $('.booking-form #parent_details_row_ids .school-det').append(rows);
        });

        // remove the parent details
        $('.booking-form #parent_details_row_ids').on("click", ".remove_parent_details", function(e) {
            var count = $('.booking-form #parent_details_row_ids').children().length;
            if (count > 2)
                e.currentTarget.parentNode.remove();
        });

        // click on payment button will redirect it payment gateway
        $('.booking-form #check_first_time').click(function(e) {
            var is_checked = $(this).prop("checked");
            if (is_checked) {
                $('.booking-form .school_history').addClass('hide');
            } else {
                $('.booking-form  .school_history').removeClass('hide');
            }
        });

        $('.btn').each(function(){
            var btnval = $(this).text();
            $(this).attr('value',btnval);
        })
    });

});
