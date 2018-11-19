export default function applicationReducer(state = {}) {
  return {
    introduction: {
      label: 'Project introduction',
      subsections: {
        details: {
          label: 'Project details',
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'text'
            },
            {
              name: 'type',
              label: 'Licence type',
              type: 'select',
              required: true,
              options: [
                { value: 'research', label: 'Research' },
                { value: 'testing', label: 'Testing or screening as a service' },
                { value: 'manufacture', label: 'Manufacture of a product' },
                { value: 'teaching', label: 'Teaching' }
              ]
            }
          ]
        }
      }
    },
    applicant: {
      label: 'Applicant information',
      subsections: {
        experience: {
          label: 'Experience',
          fields: [
            {
              name: 'experience',
              label: 'Experience',
              type: 'text'
            },
            {
              name: 'qualification',
              label: 'Qualifications',
              type: 'text'
            }
          ]
        },
        training: {
          label: 'Training'
        }
      }
    },
    location: {
      label: 'Project location',
      subsections: {
        establishment: {
          label: 'Primary establishment'
        },
        'secondary-establishments': {
          label: 'Secondary establishments'
        },
        poles: {
          label: 'Places other than licensed establishment'
        }
      }
    },
    background: {
      label: 'Scientific background',
      subsections: {
        'current-knowledge': {
          label: 'Current knowledge'
        }
      }
    },
    'project-plan': {
      label: 'Project plan',
      subsections: {
        aim: {
          label: 'Current knowledge'
        },
        objectives: {
          label: 'Objectives'
        },
        benefits: {
          label: 'Benefits'
        },
        harms: {
          label: 'Harms'
        }
      }
    },
    'three-rs': {
      label: 'The 3 Rs',
      subsections: {
        'experimental-design': {
          label: 'Experimental design'
        },
        replacement: {
          label: 'Replacement'
        },
        reduction: {
          label: 'Reduction'
        },
        refinement: {
          label: 'Refinement'
        }
      }
    }
  }
};
