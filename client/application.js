import ExperimentalDesign from './pages/sections/experimental-design';
import NTSSummary from './pages/sections/nts';
import Protocols from './pages/sections/protocols';
import DefaultSection from './pages/sections/default';
import every from 'lodash/every';
import { COMPLETE, INCOMPLETE, PARTIALLY_COMPLETE } from './constants/completeness';

export default {
  introduction: {
    title: 'Project introduction',
    subsections: {
      details: {
        title: 'Project details',
        fields: [
          {
            name: 'title',
            required: true,
            label: 'Title',
            type: 'text'
          }
        ]
      }
    }
  },
  setup: {
    title: 'Project setup',
    subsections: {
      setup: {
        title: 'Introductory details',
        component: DefaultSection,
        fields: [
          {
            name: 'species',
            label: 'What types of animals will be used in this project?',
            type: 'species-selector'
          }
        ]
      }
    }
  },
  projectPlan: {
    title: 'Project plan',
    subsections: {
      'scientific-background': {
        title: 'Scientific background',
        component: DefaultSection,
        fields: [
          {
            name: 'scientific-knowledge-summary',
            label: 'Briefly summarise the current state of scientific knowledge in your area of work.',
            hint: 'Be specific and relevant to your project aim - there\'s no need for a detailed overview of the entire landscape. Include any relevant non-animal research if it has contributed to the starting point of your project.',
            type: 'texteditor'
          },
          {
            name: 'scientific-knowledge-details',
            label: 'How will this project address any knowledge gaps or try to advance scientific knowledge in this area of work?',
            hint: 'You should refer to the basis for any scientific hypothesis you plan to test during this project.',
            type: 'texteditor'
          },
          {
            name: 'clinical-condition',
            label: 'Does your project directly relate to a particular clinical condition?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                value: 'Yes',
                label: 'Yes',
                reveal: [
                  {
                    name: 'condition-severity',
                    label: 'What is the current prevalence and severity of this condition?',
                    type: 'texteditor'
                  },
                  {
                    name: 'condition-treatments-problems',
                    label: 'What are the problems with the current treatments for this condition which mean that further work is necessary?',
                    type: 'texteditor'
                  },
                  {
                    name: 'condition-scientific-approach',
                    label: 'What is the scientific basis for your proposed approach',
                    type: 'texteditor'
                  }
                ]
              },
              'No'
            ]
          }
        ]
      },
      strategy: {
        title: 'Strategy'
      },
      'experimental-design': {
        title: 'Experiental design'
      },
      benefits: {
        title: 'Benefits',
        fields: [
          {
            name: 'benefit-outputs',
            label: 'What outputs do you think you will see at the end of this project?',
            type: 'texteditor'
          }
        ]
      }
    }
  },
  protocols: {
    title: 'Protocols',
    subsections: {
      protocols: {
        title: 'Protocols',
        name: 'protocols',
        component: Protocols,
        complete: values => {
          if (!values.protocols) {
            return INCOMPLETE;
          }
          if (values.protocols.length && every(values.protocols, p => p.complete)) {
            return COMPLETE;
          }
          return PARTIALLY_COMPLETE;
        },
        setup: {
          fields: [{
            name: 'gaas',
            label: 'Will you use genetically-altered animals (GAAs) in this project?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              'Yes',
              'No'
            ]
          },
          {
            name: 'quantitative',
            label: 'Will this project generate quantitative data',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              'Yes',
              'No'
            ]
          },
          {
            name: 'anaesthesia',
            label: 'Will you be using anaesthesia during this project',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              'Yes',
              'No'
            ]
          },
          {
            name: 'substances',
            label: 'Will you be using substances for testing or physiological effects during this project?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              'Yes',
              'No'
            ]
          }]
        },
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'text'
          },
        ],
        sections: {
          details: {
            title: 'Protocol details',
            fields: [
              {
                name: 'description',
                label: 'Briefly describe the scientific purposes of this protocol',
                hint: 'Information about protocol steps should be added later',
                type: 'texteditor'
              },
              {
                name: 'severity',
                label: 'What is the prospective severity of this protocol?',
                type: 'radio',
                options: [
                  'Mild',
                  'Moderate',
                  'Severe',
                  'Non-recovery'
                ],
                className: 'smaller'
              },
              {
                name: 'severity-details',
                label: 'Why did you choose this severity category?',
                type: 'texteditor'
              },
              {
                name: 'outputs',
                label: 'What outputs do you think may arise from this protocol?',
                hint: 'For example, test results, phenotypic information, or products.',
                type: 'texteditor'
              }
            ]
          },
          quantitative: {
            title: 'Quantitative data',
            conditional: {
              quantitative: 'Yes'
            },
            fields: [
              {
                name: 'control-groups',
                label: 'How will you use control groups?',
                type: 'textarea'
              },
              {
                name: 'control-groups-size',
                label: 'How will you determine the size of these groups?',
                type: 'textarea'
              },
              {
                name: 'effect-size',
                label: 'What \'effect size\' will you need for this protocol and why?',
                type: 'textarea'
              },
              {
                name: 'maximize-effectiveness',
                label: 'How will you maximize the effectiveness of your findings and the animals that you use on this protocol?​',
                type: 'textarea'
              },
              {
                name: 'reproducibility',
                label: 'How will you minimise variables to ensure reproducibility?',
                type: 'textarea'
              },
              {
                name: 'randomised',
                label: 'Will studies in this protocol be randomised or blinded? If so, how?​',
                type: 'textarea'
              }
            ]
          },
          animals: {
            title: 'Animals used in this protocol',
            fields: [
              {
                name: 'species',
                label: 'Which types of animals would you like to add to this protocol?',
                type: 'checkbox',
                className: 'smaller',
                inline: true,
                optionsFromKey: 'species',
                section: 'intro'
              },
              {
                name: 'life-stages',
                label: 'Which life stages will be used during this protocol?',
                hint: 'Select all that apply',
                type: 'checkbox',
                className: 'smaller',
                options: [
                  'Embryo and egg',
                  'Neonate',
                  'Juvenile',
                  'Adult',
                  'Pregnant adult'
                ]
              },
              {
                name: 'quantity',
                label: 'How many of these animals will be used in this protocol?',
                type: 'number',
              },
              {
                name: 'continued-use',
                label: 'Have any of these animals had procedures applied to them in preparation for their use on this protocol (continued use)?',
                type: 'radio',
                options: [
                  {
                    value: 'Yes',
                    label: 'Yes',
                    reveal: {
                      name: 'continued-use-sourced',
                      label: 'Where will these animals be sourced from?',
                      hint: 'This could be another protocol in this licence, another project licence, or somewhere else.',
                      type: 'textarea'
                    }
                  },
                  'No'
                ],
                inline: true,
                className: 'smaller'
              },
              {
                name: 'reuse',
                label: 'Have any of these animals been used in another protocol or project (re-use)?',
                type: 'radio',
                options: [
                  {
                    value: 'Yes',
                    label: 'Yes',
                    reveal: {
                      name: 'reuse-details',
                      label: 'Give details',
                      type: 'textarea'
                    }
                  },
                  'No'
                ],
                inline: true,
                className: 'smaller'
              },
              {
                name: 'gaas',
                label: 'Which general types or strains of GAAs will you be using and why?​',
                type: 'textarea',
                conditional: {
                  gaas: 'Yes'
                }
              },
              {
                name: 'gaas-welfare',
                label: 'Do you expect any of these GAAs to show a phenotype with moderate or severe welfare consequences?',
                type: 'radio',
                options: [
                  {
                    value: 'Yes',
                    label: 'Yes',
                    reveal: [
                      {
                        name: 'why',
                        label: 'Why are each of these phenotypes scientifically necessary?',
                        type: 'textarea'
                      },
                      {
                        name: 'how',
                        label: 'How will you control the harms associated with these phenotypes?',
                        type: 'textarea'
                      }
                    ]
                  },
                  'No'
                ],
                inline: true,
                className: 'smaller',
                conditional: {
                  gaas: 'Yes'
                }
              }
            ]
          },
          steps: {
            title: 'Steps',
            hint: 'Step numbers are for reference only, and you will be able to reorder them at any time before you submit you project licence application.',
            footer: 'Once you’ve created a list of steps, you need to add information about adverse effects, controls and limitations, and humane endpoints to each one.​',
            fields: [
              {
                name: 'title',
                type: 'textarea',
                label: 'To ensure that an adequate harm benifit assessment can be performed for your project, please provide clear and explicit information for each step.'
              },
              {
                name: 'anaesthesia',
                label: 'Does this step involve the administration of anaesthesia?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    value: 'Yes',
                    label: 'Yes',
                    reveal: {
                      name: 'code',
                      label: 'Select the anaesthetic code you intend to use',
                      type: 'radio',
                      options: [
                        'AB (general anaesthesia with recovery)',
                        'AB-L (local anaesthesia)',
                        'AC (non-recovery general anaesthesia)​',
                        'AD (neuromuscular blocking agent)'
                      ],
                      className: 'smaller'
                    }
                  },
                  'No'
                ],
                conditional: {
                  anaesthesia: 'Yes'
                }
              },
              {
                name: 'optional',
                label: 'Is this step optional?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  'Yes',
                  'No'
                ]
              }
            ],
            additional: {
              title: 'Additional information',
              fields: [
                {
                  name: 'adverse',
                  label: 'Do you expect this step to have any adverse effects for the animals?',
                  type: 'radio',
                  inline: true,
                  className: 'smaller',
                  options: [
                    {
                      value: 'Yes',
                      label: 'Yes',
                      reveal: [
                        {
                          name: 'adverse-effects',
                          label: 'What are the likely adverse effects of this step?​',
                          hint: 'State the signs for each adverse effect, including the anticipated degree and duration of suffering.',
                          type: 'textarea'
                        },
                        {
                          name: 'prevent-adverse-effects',
                          label: 'How will you attempt to prevent any of these adverse effects?​',
                          hint: 'If adverse effects can\'t be prevented, how will you attempt to ameliorate the initial signs of them?',
                          type: 'textarea'
                        },
                        {
                          name: 'minimise-suffering',
                          label: 'How do you intend to prevent or minimise the suffering of any animal experiencing adverse effects?​',
                          type: 'textarea'
                        }
                      ]
                    },
                    'No'
                  ]
                },
                {
                  name: 'endpoints',
                  label: 'What are the humane endpoints for this step?',
                  type: 'textarea'
                }
              ]
            }
          },
          experience: {
            title: 'Animal experience',
            typical: {
              title: 'Typical experience',
              fields: [
                {
                  name: 'typical-steps',
                  label: 'Describe the typical series of steps that an animal will experience during this protocol.​',
                  type: 'textarea'
                },
                {
                  name: 'typical-effects',
                  label: 'If an animal experiences this typical series of steps, what cumulative impacts or adverse effects do you anticipate?',
                  hint: 'Examples may include pain, inactivity, or abnormal behaviour. You should also state the estimated duration of these effects on an animal.',
                  type: 'textarea'
                },
                {
                  name: 'typical-percentage',
                  label: 'How many animals used in this protocol do you estimate will experience this typical series of steps?',
                  hint: 'If you’re unable to estimate a single percentage, enter a percentage range (for example 30-50%).',
                  type: 'number'
                }
              ]
            },
            maximal: {
              title: 'Maximal experience',
              fields: [
                {
                  name: 'maximal-steps',
                  label: 'Describe the potential series of steps in this protocol that will cause the greatest suffering to an animal?',
                  hint: 'Include information about the potential intensity of suffering.',
                  type: 'textarea'
                },
                {
                  name: 'maximal-effects',
                  label: 'If an animal experiences this maximal series of steps, what cumulative impacts or adverse effects do you anticipate?',
                  hint: 'Examples may include pain, inactivity, or abnormal behaviour. You should also state the estimated duration of these effects on an animal.',
                  type: 'textarea'
                },
                {
                  name: 'maximal-percentage',
                  label: 'How many animals used in this protocol do you estimate will experience this maximal series of steps?',
                  hint: 'If you’re unable to estimate a single percentage, enter a percentage range (for example 30-50%).',
                  type: 'number'
                }
              ]
            }
          },
          justification: {
            title: 'Protocol justification',
            label: 'Why is each model, type of study, or technique proposed in this protocol​',
            fields: [
              {
                name: 'most-appropriate',
                label: 'a) the most appropriate for your scientific objectives?​',
                type: 'textarea'
              },
              {
                name: 'most-refined',
                label: 'b) the most refined?',
                type: 'textarea'
              },
              {
                name: 'scientific-endpoints',
                label: 'What are the scientific endpoints for each model or technique in this protocol?',
                hint: 'Include any clinical signs that you expect to see for each one.​',
                type: 'textarea'
              },
              {
                name: 'scientific-endpoints-justification',
                label: 'Why can\'t you achieve your objectives by using an earlier scientific endpoint, that would reduce the degree of harm experienced by an animal?',
                hint: 'Take into account any phenotypic adverse effects if relevant.',
                type: 'textarea'
              },
              {
                name: 'minimise-duration',
                label: 'How will you minimise the duration and intensity of suffering for animals in this protocol?',
                type: 'textarea'
              },
              {
                name: 'monitor-pain',
                label: 'How will you monitor animals for pain and provide appropriate levels of analgesia?​',
                type: 'textarea'
              },
              {
                name: 'substances-suitibility',
                label: 'How will you assess the suitability of substances given to the particular strain/type of animal you will be using?',
                hint: 'For example, you may need to evaluate the toxicity, efficacy and sterility of these substances.',
                type: 'textarea',
                conditional: {
                  substances: 'Yes'
                }
              },
              {
                name: 'dosing-regimen',
                label: 'How will you determine an appropriate dosing regimen?​',
                hint: 'Explain how you considered the routes, dose volumes, frequencies, and overall duration of a dosing regimen.',
                type: 'textarea',
                conditional: {
                  substances: 'Yes'
                }
              },
              {
                name: 'max-repetitions',
                label: 'What’s the maximum number of times that the same animal could go through this protocol?',
                type: 'number'
              },
              {
                name: 'repetitions-justification',
                label: 'How have you estimated the maximum number of times you will need to repeat this protocol using the same animal?',
                type: 'textarea'
              }
            ]
          },
          fate: {
            title: 'Fate of animals',
            fields: [
              {
                name: 'fate',
                label: 'What will happen to animals at the end of this protocol?​',
                hint: 'Select all that apply',
                type: 'checkbox',
                className: 'smaller',
                options: [
                  'Kept alive',
                  'Re-used',
                  'Continued use',
                  'Set free',
                  'Re-homed',
                  {
                    value: 'Killed',
                    label: 'Killed',
                    reveal: {
                      label: '',
                      review: 'Method of killing',
                      name: 'killing-method',
                      type: 'radio',
                      className: 'smaller',
                      options: [
                        'Schedule 1 method​',
                        {
                          value: 'Non-schedule 1 method​',
                          label: 'Non-schedule 1 method​',
                          reveal: {
                            name: 'method-and-justification',
                            label: 'State the method of killing that you will use along with your justification for using it.​',
                            type: 'textarea'
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        }
      },
      'project-harms': {
        title: 'Project harms',
        component: DefaultSection,
        nts: true,
        complete: values => {
          if (values['project-harms-complete']) {
            return COMPLETE;
          }
        },
        fields: [
          {
            name: 'project-harms-summary',
            label: 'Summarise what will typically be done to an animal used on your project.',
            hint: 'Include any relevant information about injections, surgery, experiment durations and the number of procedures an animal may experience.',
            type: 'texteditor'
          },
          {
            name: 'project-harms-effects',
            label: 'What do you expect will be the impacts or adverse effects that an animal may experience during your project?',
            hint: 'Examples may include pain, inactivity, or abnormal behaviour. You should also state the estimated duration of these effects on the animal.',
            type: 'texteditor'
          },
          {
            name: 'project-harms-severity',
            label: 'What are the expected severities and the proportion of animals in each category (per species)?',
            type: 'texteditor'
          }
        ]
      },
      'fate-of-animals': {
        title: 'Fate of animals',
        component: DefaultSection,
        nts: true,
        complete: values => {
          if (values['fate-of-animals-complete']) {
            return COMPLETE;
          }
        },
        fields: [
          {
            name: 'fate-of-animals',
            label: 'What will happen to animals at the end of their use in this project?',
            type: 'texteditor'
          }
        ]
      }
    }
  },
  'project-plan': {
    title: 'Project plan',
    subsections: {
      'sandwich-design': {
        title: 'Sandwich design',
        component: ExperimentalDesign,
        fields: [
          {
            name: 'bread',
            label: 'What kind of bread would you like in your sandwich?',
            type: 'radio',
            options: [
              'White',
              'Brown'
            ],
            step: 0
          },
          {
            name: 'meat',
            label: 'What kind of meat would you like in your sandwich?',
            type: 'radio',
            options: [
              'Chicken',
              'Pork',
              'Beef'
            ],
            step: 0
          },
          {
            name: 'salad',
            label: 'What salads would you like included in your sandwich?',
            type: 'checkbox',
            options: [
              'Lettuce',
              'Tomato',
              'Cucumber'
            ],
            step: 1
          },
          {
            name: 'additional-instructions',
            label: 'Are there any additional requests?',
            type: 'texteditor',
            step: 2
          }
        ]
      }
    }
  },
  threeRs: {
    title: 'The 3Rs',
    subsections: {
      replacement: {
        title: 'Replacement',
        reviewTitle: '3Rs: Replacement',
        component: DefaultSection,
        complete: values => {
          if (values['replacement-complete']) {
            return COMPLETE;
          }
        },
        nts: true,
        fields: [
          {
            name: 'replacement-alternatives',
            label: 'Which non-animal alternatives did you consider for use in this project?',
            type: 'texteditor'
          },
          {
            name: 'replacement-justification',
            label: 'Why were they not suitable?',
            type: 'texteditor'
          }
        ]
      },
      reduction: {
        title: 'Reduction',
        reviewTitle: '3Rs: Reduction',
        component: DefaultSection,
        nts: true,
        complete: values => {
          if (values['reduction-complete']) {
            return COMPLETE;
          }
        },
        fields: [
          {
            name: 'reduction-quantities',
            label: 'Enter the estimated numbers of animals used in this project',
            type: 'animal-quantities'
          },
          {
            name: 'reduction-estimation',
            label: 'How did you estimate these numbers?',
            hint: 'For example, you may have made some power calculations or carried out some statistical modelling.',
            type: 'texteditor'
          },
          {
            name: 'reduction-steps',
            label: 'What steps did you take to reduce animal numbers when you designed your experiments?',
            hint: 'For example, you may have made some power calculations or carried out some statistical modelling.',
            type: 'texteditor'
          },
          {
            name: 'reduction-review',
            label: 'How will you review these estimates as the project progresses',
            hint: 'This may include pilot studies, computer modelling, or sharing of tissue.',
            type: 'texteditor'
          }
        ]
      },
      refinement: {
        title: 'Refinement',
        reviewTitle: '3Rs: Refinement',
        component: DefaultSection,
        nts: true,
        complete: values => {
          if (values['refinement-complete']) {
            return COMPLETE;
          }
        },
        fields: [
          {
            name: 'refinement-models',
            label: 'Which animal models and methods will you use during this project',
            hint: 'Explain why these models and methods cause the least pain, suffering, distress or lasting harm to the animals?',
            type: 'texteditor'
          },
          {
            name: 'refinement-explaination',
            label: 'How will you refine the methods and procedures you\'re using as this project progresses',
            hint: 'Potential refinements include increased monitoring, post-operative care, pain management, and training of animals.',
            type: 'texteditor'
          }
        ]
      }
    }
  },
  nts: {
    title: 'Non-technical summary',
    subsections: {
      review: {
        title: 'Review',
        component: NTSSummary,
        sections: [
          // {
          //   name: 'aim',
          //   title: 'Aim and duration'
          // },
          {
            name: 'benefits',
            title: 'Benefits'
          },
          {
            name: 'project-harms',
            title: 'Anticipated harms'
          },
          {
            name: 'fate-of-animals',
            title: 'Fate of animals'
          },
          // {
          //   name: 'replacement',
          //   title: 'Replacement'
          // },
          // {
          //   name: 'reduction',
          //   title: 'Reduction'
          // },
          // {
          //   name: 'refinement',
          //   title: 'Refinement'
          // }
        ]
      }
    }
  }
}
