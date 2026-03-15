export interface PediatricianSalary {
  _id: string
  hospitalName: string
  city: string
  state: string
  rating: number
  specialty: string
  careerStage: 'Resident' | 'Fellow' | 'Attending'
  annualBaseSalary: number
  receivedSignOnBonus: 'Yes' | 'No'
  signOnBonusAmount?: string
  productivityBonus: 'Yes - RVU based' | 'Yes - Quality based' | 'No'
  hasMoonlighting: 'Yes' | 'No'
  moonlightingIncome?: string
  fteStatus: '1.0 Full Time' | '<1.0 Part Time'
  avgClinicalHoursPerWeek?: string
  callFrequency?: string
  yearsInRole: string
  pslfEligible?: 'Yes' | 'No' | 'Unsure'
  practiceSetting: string
  housingStipend?: 'Yes' | 'No'
  programUnionized?: 'Yes' | 'No'
  additionalComments?: string
  submittedAt: string
}

export interface SiteStats {
  totalSubmissions: number
  totalHospitals: number
  totalStates: number
  avgSalary: number
  highestSalary: number
}
