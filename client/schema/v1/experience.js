module.exports = {
  title: 'Experience',
  fields: [
    {
      name: 'experience-projects',
      label: 'Have you managed similar work in this field before?',
      alt: {
        label: 'Has this person managed similar work in this field before?'
      },
      type: 'radio',
      inline: true,
      className: 'smaller',
      options: [
        {
          label: 'Yes',
          value: true,
          reveal: {
            name: 'experience-achievements',
            label: 'What were your, or your group\'s, main achievements that are relevant to this application?',
            alt: {
              label: 'What were this person\'s, or their group\'s, main achievements that are relevant to this application?'
            },
            type: 'texteditor'
          }
        },
        {
          label: 'No',
          value: false
        }
      ]
    },
    {
      name: 'experience-knowledge',
      label: 'What relevant scientific knowledge or education do you have?',
      alt: {
        label: 'What relevant scientific knowledge or education does this person have?'
      },
      type: 'texteditor'
    },
    {
      name: 'experience-animals',
      label: 'What experience do you have of using the types of animals and experimental models stated in this licence application?',
      alt: {
        label: 'What experience does this person have of using the types of animals and experimental models stated in this licence application?'
      },
      type: 'texteditor'
    },
    {
      name: 'experience-experimental-design',
      label: 'What experimental design and data analysis training have you had?',
      alt: {
        label: 'What experimental design and data analysis training has this person had?',
        hint: 'If they do not have this expertise, how will they access it?'
      },
      hint: 'If you do not have this expertise, how will you access it?',
      type: 'texteditor'
    },
    {
      name: 'experience-others',
      label: 'Why are you the most suitable person in the research group, department or company to manage the project?',
      alt: {
        label: 'Why is this person the most suitable in the research group, department or company to manage the project?'
      },
      type: 'texteditor'
    },
    {
      name: 'funding-previous',
      label: 'What relevant expertise and staffing will be available to help you to deliver the programme of work?',
      alt: {
        label: 'What relevant expertise and staffing will be available to help deliver the programme of work?'
      },
      hint: 'Include examples of practical, technical, and specialist support.',
      type: 'texteditor'
    },
    {
      name: 'other-people',
      label: 'Will other people help you manage the project? If so, how?',
      alt: {
        label: 'Will other people help this person manage the project? If so, how?'
      },
      type: 'texteditor'
    }
  ]
};
