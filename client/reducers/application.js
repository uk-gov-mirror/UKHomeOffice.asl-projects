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
          label: 'Experience'
        },
        training: {
          label: 'Training'
        }
      }
    }
  }
};
