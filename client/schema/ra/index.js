export default () => ({
  introduction: {
    title: 'Assessment sections',
    subsections: {
      aims: {
        title: 'Project aims',
        fields: [
          {
            name: 'continue-on-other-licence',
            label: 'Is there a plan for this work to continue under another licence?',
            type: 'radio',
            options: [
              {
                label: 'Yes',
                value: true
              },
              {
                label: 'No',
                value: false
              }
            ]
          },
          {
            name: 'aims-achieved',
            label: 'Did the project achieve its aims and if not, why not?',
            hint: 'Described whether the programme of work has been carried out and the extent to which the objectives (aims) of the programme of work have been achieved. Include a summary of the benefits delivered. If aims were only partially achieved, explain why.',
            raPlayback: {
              name: {
                default: 'project-aim',
                legacy: 'aims'
              },
              summary: 'Show the project\'s projected aims'
            },
            type: 'texteditor'
          }
        ]
      },
      harms: {
        title: 'Harms',
        fields: [
          {
            name: 'actual-harms',
            label: 'What harms were caused to the animals, how severe were those harms and how many animals were affected?',
            hint: `Summarise the overall amount of harm caused to animals by describing the procedures, harms, and adverse effects. You must include the species and number of animals subjected to regulated procedures and the actual severity of those procedures.

Don't just list procedures but reflect on the animals' experience. For example, 'animals experienced mild discomfort as tumours 10mm wide were allowed to grow under the skin'.

If animals went through procedures more than once, make sure this is reflected in the numbers and in your assessment of their overall suffering.`,
            raPlayback: {
              name: {
                default: ['project-harms-effects', 'project-harms-severity'],
                legacy: 'nts-adverse-effects'
              },
              summary: 'Show the project\'s projected harms'
            },
            type: 'texteditor'
          }
        ]
      },
      replacement: {
        title: 'Replacement',
        fields: [
          {
            name: 'replacement',
            label: 'What, if any, non-animal alternatives were used or explored after the project started, how effective were they and are there any lessons worth sharing with others?',
            hint: 'These are non-animal alternatives that became available or viable after the project licence was granted. They could include genetically engineered tissue or computer modelling, for example.',
            type: 'texteditor'
          }
        ]
      },
      reduction: {
        title: 'Reduction',
        fields: [
          {
            name: 'reduction',
            label: 'How did you minimise the number of animals used on your project and is there anything others can learn from your experience?',
            raPlayback: {
              name: {
                default: ['reduction-steps', 'reduction-review'],
                training: ['training-reduction-techniques', 'training-reduction-animal-numbers', 'training-reduction-other-measures'],
                legacy: 'reduction'
              },
              summary: 'Show the project\'s planned reduction measures'
            },
            type: 'texteditor'
          }
        ]
      },
      refinement: {
        title: 'Refinement',
        fields: [
          {
            name: 'refinement',
            label: 'With the knowledge you have now, could the choice of animals or models used have been improved at all? How did you minimise harm to animals during the project?',
            hint: 'High quality facilities and good processes for managing the animals\' care and wellbeing can reduce harms, for example.',
            raPlayback: {
              name: {
                default: ['refinement-explaination', 'refinement-published-guidance'],
                legacy: 'refinement'
              },
              summary: 'Show the project\'s planned refinement measures'
            },
            type: 'texteditor'
          }
        ]
      }
    }
  }
});
