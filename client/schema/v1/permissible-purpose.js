const permissiblePurpose = {
  name: 'permissible-purpose',
  label: 'Which permissible purposes apply to this project?',
  type: 'permissible-purpose',
  className: 'smaller',
  options: [
    {
      label: '(a) Basic research',
      value: 'basic-research'
    },
    {
      label: '(b) Translational or applied research with one of the following aims:',
      value: 'translational-research',
      reveal: {
        name: 'translational-research',
        label: '',
        type: 'checkbox',
        className: 'smaller',
        options: [
          {
            label: '(i) Avoidance, prevention, diagnosis or treatment of disease, ill-health  or abnormality, or their effects, in man, animals or plants',
            value: 'translational-research-1'
          },
          {
            label: '(ii) Assessment, detection, regulation or modification of physiological conditions in man, animals or plants',
            value: 'translational-research-2'
          },
          {
            label: '(iii) Improvement of the welfare of animals or of the production conditions for animals reared for agricultural purposes',
            value: 'translational-research-3'
          }
        ]
      }
    },
    {
      label: '(c) Development, manufacture or testing of the quality, effectiveness and safety of drugs, foodstuffs and feedstuffs or any other substances or products, with one of the following aims mentioned in paragraph (b)',
      value: 'safety-of-drugs'
    },
    {
      label: '(d) Protection of the natural environment in the interests of the health or welfare of man or animals',
      value: 'protection-of-environment'
    },
    {
      label: '(e) Research aimed at preserving the species of animal subjected to regulated procedures as part of the programme of work',
      value: 'preservation-of-species'
    },
    {
      label: '(g) Forensic enquiries',
      value: 'forensic-enquiries'
    }
  ]
};

export default permissiblePurpose;
