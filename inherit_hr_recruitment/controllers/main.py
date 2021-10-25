import base64
import json
import requests
from datetime import datetime, date, timedelta as td

from odoo import http
from odoo.http import request
from odoo.exceptions import ValidationError
from odoo.modules.module import get_module_resource
from odoo.tools import DEFAULT_SERVER_DATE_FORMAT
from datetime import datetime, timedelta
import werkzeug
from werkzeug import utils

def default_stage_id(hr_applicant_id):
        if hr_applicant_id._context.get('default_job_id'):
            ids = request.env['hr.recruitment.stage'].search([
                '|',
                ('job_id', '=', False),
                ('job_id', '=', request._context['default_job_id']),
                ('fold', '=', False)
            ], order='sequence asc', limit=1).ids
            if ids:
                return ids[0]
        return False
class AdmissionEnquiry(http.Controller):

    @http.route('/application_form', auth='public', website=True)
    def index(self, **kw):

        nationality_ids = request.env['res.country'].sudo().search([])
        job_ids = request.env['hr.job'].sudo().search([])
        source_ids = request.env['utm.source'].sudo().search([])
        print(source_ids)
        values = {
            'nationality_ids': nationality_ids,
            'job_ids': job_ids,
            'source_ids': source_ids,
            
        }
        return http.request.render('website.application_form', values)


    @http.route(['/hr_applicant/creation/'], auth="public", website=True)
    def applicant_creations(self, **post):
        # if post.get("passport_image_file"):
        #         # passport_file_type = post.get("passport_image_file").filename.split('.')[1]
        #         passport_image_fileephoto = request.httprequest.files.getlist('passport_image_file')
        #         passport = passport_image_fileephoto[0].read()
        #         # passportdatas1 = base64.b64encode(passport)
        #         passportdatas_v = base64.b64encode(passport).replace(b'\n', b'')
        file_name = post.get('file_name')
        file_data = post.get('file_data')
        # file_data = post.get('file_data').replace('data:image/jpeg;base64,', '')
        file_type = post.get('file_type')
        if file_data is not None and ',' in file_data:
            data_array = file_data.split(',')
            file_data = data_array[1]
            file_data = file_data.replace(' ', '')
        
        std_file_name = post.get('std_file_name')
        std_file_data = post.get('std_file_data')
        std_file_type = post.get('std_file_type')
        if std_file_data is not None and ',' in std_file_data:
            data_array = std_file_data.split(',')
            std_file_data = data_array[1]
        hr_applicant_record = request.env['hr.applicant'].sudo().create(
            {
             'name': request.params.get('emp_name')+ " "+ "Application",
             'partner_name': request.params.get('emp_name'),
             'salary_expected': int(request.params.get('salary_expected')),
             'email_from': request.params.get('candidate_email'),
             'partner_mobile': request.params.get('partner_mobile'),
             'country_id': int(request.params.get('nationality_id')),
             'job_id': int(request.params.get('job_id')),
             'source_id': int(request.params.get('source_id')),
             'image': file_data, #post.get('std_file_data'),
             'questionnaire': post.get('why_should_hire'),
             })
        img_id = request.env['ir.attachment'].sudo().create({'name': std_file_name,
                                    'datas': std_file_data,
                                    'datas_fname': std_file_name,
                                    'res_model': 'hr.applicant',
                                    'res_id': hr_applicant_record.id,
                                   })
        cv_id = request.env['ir.attachment'].sudo().create({
                                   'name': file_name,
                                    'datas': file_data,
                                    'datas_fname': file_name,
                                    'res_model': 'hr.applicant',
                                    'res_id': hr_applicant_record.id,
                                   })
        exp_details_records = []
        edu_details_records = []
        if post.get('exp_details_datas'):
            exp_details_str = str(post.get('exp_details_datas'))
            exp_details_json_obj = json.loads(exp_details_str)
            for exp_detail in exp_details_json_obj:
                if exp_detail:
                    exp_details_records.append((0, 0, {'date_from': exp_detail.get("exp_date_from"),
                                                       'date_to': exp_detail.get("exp_date_to"),
                                                   'job_title': exp_detail.get("job_title"),
                                                   'company': exp_detail.get("company"),
                                                    'is_present': True if exp_detail.get("is_present") == 'on' else False,
                                                   'hr_applicant_id': hr_applicant_record.id,
                                                      }
                                               ))
        if post.get('edu_details_datas'):
            edu_details_str = str(post.get('edu_details_datas'))
            edu_details_json_obj = json.loads(edu_details_str)
            for edu_detail in edu_details_json_obj:
                edu_details_records.append((0, 0, {'date_from': edu_detail.get("date_from"),
                                                   'date_to': edu_detail.get("date_to"),
                                                   'degree': edu_detail.get("degree"),
                                                   'major': edu_detail.get("major"),
                                                   'university': edu_detail.get("university"),
                                                   'gpa': edu_detail.get("gpa"),
                                                    'is_present': True if exp_detail.get("is_present") == 'on' else False,
                                                   'hr_applicant_id': hr_applicant_record.id,
                                                      }
                                               ))
        
        hr_applicant_record.write({
            # 'emp_attachment_ids': img_id,
            'attachment_ids': cv_id,
            'educational_history_ids': edu_details_records,
            'experience_history_ids': exp_details_records,
            # 'image': post.get('std_file_data')
            })
        
        if hr_applicant_record and hr_applicant_record:
            # send mail to parent once enquiry form submit.
            mail_template = request.env['mail.template'].sudo().search([('model', '=', 'hr.applicant')])
            if mail_template:
                template_id = request.env['ir.model.data'].get_object_reference('inherit_hr_recruitment',
                                                                                'application_mail_templates')[1]
                template_browse = request.env['mail.template'].sudo().browse(template_id)
                email_to = hr_applicant_record.email_from
                if template_browse:
                    mail_values = {}
                    mail_values['email_to'] = email_to
                    mail_values['res_id'] = False
                    html_content = template_browse.body_html
                    
                    base_url = request.env['ir.config_parameter'].sudo().get_param('web.base.url')
                    application_data = 'applicant_id=' + str(hr_applicant_record.id)
                    encode_address = base64.b64encode(application_data.encode("UTF-8"))
     
                    s1 = encode_address.decode("UTF-8")
                    application_url = base_url + '/application_form_status/'+s1
                    encode_application_url = application_url
                    html_content = html_content.replace('form_link', encode_application_url)
                    mail_values['body_html'] = html_content
                    if not mail_values['email_to'] and not mail_values['email_from']:
                        pass
                    mail_mail_obj = request.env['mail.mail']
                    msg_id = mail_mail_obj.sudo().create(mail_values)
                    if msg_id:
                        mail_mail_obj.send(msg_id)
        values= {}
        return http.request.render("inherit_hr_recruitment.application_form_success_page", values)

    
    
    @http.route('/application_form_status/<params>', auth='public', website=True, type='http')
    def application_form_status(self, **post):
        result_obj = ''
        stages_lst = []
        # if post:
        post_params = post.get('params')
        if post_params != 'undefined':
            d = base64.b64decode(post_params.encode("UTF-8"))
            params_values = d.decode("UTF-8")
            result_obj = {x.split('=')[0]: x.split('=')[1] for x in params_values.split("&")}
        print(result_obj, "result_obj")
        applicant_id = result_obj.get("applicant_id")
        hr_applicant_id = request.env['hr.applicant'].sudo().search([('id', '=', applicant_id)])
        hr_applicant_stage_ids = request.env['hr.recruitment.stage'].sudo().search([])
        for hr_applicant_stage_id in hr_applicant_stage_ids:
            stages_lst.append(hr_applicant_stage_id.name)
        print(hr_applicant_id.stage_id.name)
        values = {
            'hr_applicant_id': hr_applicant_id,
            'hr_applicant_stage_ids': hr_applicant_stage_ids,
            'stage_name': hr_applicant_id.stage_id.name
        }
        print(values)
        
        return http.request.render('inherit_hr_recruitment.application_form_status_tracker', values)


