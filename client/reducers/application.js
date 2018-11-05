export default function applicationReducer(state = {}) {
  return {
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
    },
    research: {
      show: values => ['research', 'testing'].includes(values.type),
      label: 'Project plan',
      fields: [
        {
          name: 'plan',
          label: 'Project plan',
          type: 'textarea'
        }
      ]
    },
    manufacture: {
      show: values => ['manufacture'].includes(values.type),
      label: 'Product details',
      fields: [
        {
          name: 'product',
          label: 'What are you manufacturing?',
          type: 'textarea'
        }
      ]
    },
    teaching: {
      show: values => ['teaching'].includes(values.type),
      label: 'Teaching details',
      fields: [
        {
          name: 'teaching',
          label: 'What are you teaching?',
          type: 'textarea'
        }
      ]
    },
    protocols: {
      show: values => !!values.type,
      label: 'Protocols',
      fields: [
        {
          name: 'protocols',
          label: 'Protocols',
          type: 'textarea'
        }
      ]
    }
  }
};
