from odoo import fields, models, api, tools, _
from odoo.exceptions import ValidationError

class HrApplicant(models.Model):
    _inherit = 'hr.applicant'
    
    country_id = fields.Many2one('res.country')
    emp_attachment_ids = fields.Many2many('ir.attachment', 'candidate_image_rel', 'candidate_image_id',
                                      'attachment_id', 'Attachments',
                                      )
    image = fields.Binary()
    educational_history_ids = fields.One2many('emp.educational.detail', 'hr_applicant_id', 'Educational Details')
    experience_history_ids = fields.One2many('emp.experience.detail', 'hr_applicant_id', 'Experience Details')
    questionnaire = fields.Text('why should we hire you ?')
    
class EmpEducationDetails(models.Model):
    _name = 'emp.educational.detail'
    
    date_from = fields.Date('Date from')
    date_to = fields.Date('Date to')
    degree = fields.Char('Degree')
    major = fields.Char('Major')
    university = fields.Char('University')
    gpa = fields.Char('GPA')
    is_present = fields.Boolean('Is Present')
    hr_applicant_id = fields.Many2one('hr.applicant')

class EMPExperienceDetails(models.Model):
    _name = 'emp.experience.detail'
    
    date_from = fields.Date('Date from')
    date_to = fields.Date('Date to')
    job_title = fields.Char('Job title')
    company = fields.Char('Company')
    is_present = fields.Boolean('Is Present')
    hr_applicant_id = fields.Many2one('hr.applicant')
