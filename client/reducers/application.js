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
              required: true,
              label: 'Title',
              type: 'text'
            },
            {
              name: 'type',
              required: true,
              label: 'Licence type',
              type: 'radio',
              options: [
                { value: 'research', label: 'Research' },
                { value: 'provision-testing', label: 'Provision of regulatory testing' },
                { value: 'provision-product', label: 'Provision of a product' },
                { value: 'testing', label: 'Testing or screening' },
                { value: 'manufacture', label: 'Manufacture of a product' },
                { value: 'teaching-knowledge', label: 'Teaching (knowledge)' },
                { value: 'teaching-skills', label: 'Teaching (skills)' }
              ]
            },
            {
              name: 'overall-aim',
              required: true,
              label: 'What is the overall aim of this project?',
              type: 'textarea'
            },
            {
              name: 'why-important',
              required: true,
              label: 'Why is it important to undertake this work?',
              type: 'textarea'
            },
            {
              name: 'duation',
              required: true,
              label: 'What will be the duration of this project?',
              type: 'radio',
              options: [
                { value: '1', label: '1 year' },
                { value: '2', label: '2 years' },
                { value: '3', label: '3 years' },
                { value: '4', label: '4 years' },
                { value: '5', label: '5 years' },
              ]
            },
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
