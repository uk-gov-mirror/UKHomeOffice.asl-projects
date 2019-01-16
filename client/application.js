import ExperimentalDesign from './pages/sections/experimental-design';
import NTSSummary from './pages/sections/nts';
import Protocols from './pages/sections/protocols';
import Objectives from './pages/sections/objectives';
import ObjectivesReview from './pages/sections/objectives/review';

import every from 'lodash/every';
import some from 'lodash/some';

import { COMPLETE, INCOMPLETE, PARTIALLY_COMPLETE } from './constants/completeness';

export default {
  introduction: {
    title: 'Project introduction',
    subsections: {
      introduction: {
        title: 'Introductory details',
        steps: [
          {
            title: 'Apply for project licence - 1 of 2',
            subtitle: 'Project information',
            fields: [
              {
                name: 'main-output',
                label: 'What is the main output of your project',
                type: 'radio',
                className: 'smaller',
                options: [
                  {
                    label: 'To carry out or support research',
                    value: 'research',
                    hint: 'This can be for yourself or in collaboration with others and can include basic or translational research and non-regulatory drug/device development.'
                  },
                  {
                    label: 'To produce animals or antibodies for supply to others',
                    value: 'animals',
                    hint: 'This can include genetically altered or surgically prepared animals.'
                  },
                  {
                    label: 'To produce or support the production of blood products, vaccines or medicines for medical or veterinary use.',
                    value: 'blood-products'
                  },
                  {
                    label: 'To generate testing or screening data.',
                    value: 'screening-data',
                    hint: 'This can be for yourself or for others, for regulatory (GLP work) or non regulatory use.',
                    reveal: {
                      name: 'main-output-testing-screening',
                      label: 'What will you be generating testing or screening data for?',
                      type: 'radio',
                      options: [
                        {
                          label: 'To produce animals or antibodies for supply to others',
                          value: 'supply-to-others',
                          hint: 'This can include genetically altered or surgically prepared animals.'
                        },
                        {
                          label: 'Non regulatory use',
                          value: 'non-regulatory-use',
                          hint: 'If done for others, the models and methods used are likely to be tailored to the needs of one particular client'
                        }
                      ]
                    }
                  },
                  {
                    label: 'To teach practical skills or knowledge',
                    value: 'teach',
                    hint: 'For example, microsurgery, or to use animals as part of a higher education course, such as physiology.'
                  }
                ]
              }
            ]
          },
          {
            title: 'Apply for project licence - 2 of 2',
            subtitle: 'Project introduction',
            nts: true,
            fields: [
              {
                name: 'title',
                label: 'What\'s the title of this project?',
                type: 'text'
              },
              {
                name: 'project-aim',
                label: 'What\'s the overall aim of this project?',
                type: 'texteditor'
              },
              {
                name: 'project-importance',
                label: 'Why is it important to undertake this work?',
                type: 'texteditor'
              },
              {
                name: 'duration',
                label: 'What will be the duration of this project?',
                type: 'duration',
                max: 60,
                min: 1
              },
              {
                name: 'species',
                label: 'What types of animals will be used in this project?',
                type: 'species-selector',
                summary: true
              }
            ]
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
                label: 'Yes',
                value: true,
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
              {
                label: 'No',
                value: false
              }
            ]
          }
        ]
      },
      strategy: {
        title: 'Strategy',
        playback: 'project-aim',
        review: ObjectivesReview,
        steps: [
          {
            title: 'Strategy - 1 of 2',
            component: Objectives,
            repeat: 'objectives',
            fields: [
              {
                name: 'title',
                label: 'Title',
                type: 'text'
              },
              {
                name: 'how',
                label: 'How will you achieve this scientific objective?',
                hint: 'Refer to existing in silico, in vitro, and ex vivo procedures that will contribute to achieving this objective.',
                type: 'texteditor'
              }
            ]
          },
          {
            title: 'Strategy - 2 of 2',
            fields: [
              {
                name: 'objectives-how',
                label: 'How will these objectives help you to achieve your aim?',
                hint: 'Remember to include the results of any work carried out in other project licences that will influence your research strategy.',
                type: 'texteditor'
              },
              {
                name: 'objectives-alternatives',
                label: 'How will you look for, or develop, new non-animal alternatives as this project progresses?',
                type: 'texteditor'
              }
            ]
          }
        ]
      },
      'experimental-design': {
        title: 'Experiental design',
        steps: [
          {
            title: 'Experiental design - 1 of 2',
            intro: 'There are several useful resources to help you plan your experiments. It is recommended that you read the ARRIVE or PREPARE guidelines, or use the NC3Rs\' Experimental Design Assistant before answering the questions in this section.',
            fields: [
              {
                name: 'experimental-design-how',
                label: 'How have you ensured that your experiments are appropriately designed and correctly powered to achieve your aim and objectives?',
                type: 'texteditor'
              },
              {
                name: 'experimental-design-analysis',
                label: 'How will you ensure that the results of your experiments are effectively analysed?',
                type: 'texteditor'
              },
              {
                name: 'experimental-design-repeating',
                label: 'Will you be repeating work that has already been undertaken by others?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'experimental-design-repeating-justification',
                      label: 'What is the scientific justification for repeating this work?',
                      type: 'texteditor'
                    }
                  },
                  {
                    label: 'No',
                    value: false
                  }
                ]
              }
            ]
          },
          {
            title: 'Experiental design - 2 of 2',
            fields: [
              {
                name: 'experimental-design-data',
                label: 'Does data exist from previous work? If it does, how will you use it to reduce animal use in this project?',
                type: 'texteditor'
              },
              {
                name: 'experimental-design-sexes',
                label: 'Will you use animals of both sexes in this project?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true
                  },
                  {
                    label: 'No',
                    value: false,
                    reveal: {
                      name: 'experimental-design-sexes-justification',
                      label: 'Why will you not use animals of both sexes?',
                      type: 'texteditor'
                    }
                  }
                ]
              },
              {
                name: 'experimental-design-pilot-studies',
                label: 'Will you run pilot studies for this project?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'experimental-design-pilot-studies-description',
                      label: 'Describe what you will do in your pilot studies.',
                      hint: 'You may find the NC3Rs\' Guidance On Pilot Studies helpful when you\'re answering this question.',
                      type: 'texteditor'
                    }
                  },
                  {
                    label: 'No',
                    value: false
                  }
                ]
              }
            ]
          }
        ]
      },
      benefits: {
        title: 'Benefits',
        nts: true,
        fields: [
          {
            name: 'benefit-outputs',
            label: 'What outputs do you think you will see at the end of this project?',
            hint: 'Outputs can include new information, publications, or products. Outputs may be short-term, or they may not be fully realised until you\'ve completed the project. Consider all timescales in your answer.',
            type: 'texteditor'
          },
          {
            name: 'benefit-who',
            label: 'Who or what will benefit from these outcomes?',
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
              {
                label: 'Yes',
                value: true,
              },
              {
                label: 'No',
                value: false
              }
            ]
          },
          {
            name: 'quantitative',
            label: 'Will this project generate quantitative data',
            type: 'radio',
            inline: true,
            className: 'smaller',
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
            name: 'anaesthesia',
            label: 'Will you be using anaesthesia during this project',
            type: 'radio',
            inline: true,
            className: 'smaller',
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
            name: 'substances',
            label: 'Will you be using substances for testing or physiological effects during this project?',
            type: 'radio',
            inline: true,
            className: 'smaller',
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
                  {
                    label: 'Mild',
                    value: 'mild'
                  },
                  {
                    label: 'Moderate',
                    value: 'moderate'
                  },
                  {
                    label: 'Severe',
                    value: 'severe'
                  },
                  {
                    label: 'Non-recovery',
                    value: 'non-recovery'
                  }
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
              quantitative: true
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
                  {
                    label: 'Embryo and egg',
                    value: 'embryo'
                  },
                  {
                    label: 'Neonate',
                    value: 'neonate'
                  },
                  {
                    label: 'Juvenile',
                    value: 'juvenile'
                  },
                  {
                    label: 'Adult',
                    value: 'adult'
                  },
                  {
                    label: 'Pregnant adult',
                    value: 'pregnant'
                  }
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
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'continued-use-sourced',
                      label: 'Where will these animals be sourced from?',
                      hint: 'This could be another protocol in this licence, another project licence, or somewhere else.',
                      type: 'textarea'
                    }
                  },
                  {
                    label: 'No',
                    value: false
                  }
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
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'reuse-details',
                      label: 'Give details',
                      type: 'textarea'
                    }
                  },
                  {
                    label: 'No',
                    value: false
                  }
                ],
                inline: true,
                className: 'smaller'
              },
              {
                name: 'gaas',
                label: 'Which general types or strains of GAAs will you be using and why?​',
                type: 'textarea',
                conditional: {
                  gaas: true
                }
              },
              {
                name: 'gaas-welfare',
                label: 'Do you expect any of these GAAs to show a phenotype with moderate or severe welfare consequences?',
                type: 'radio',
                options: [
                  {
                    label: 'Yes',
                    value: true,
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
                  {
                    label: 'No',
                    value: false
                  }
                ],
                inline: true,
                className: 'smaller',
                conditional: {
                  gaas: true
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
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'code',
                      label: 'Select the anaesthetic code you intend to use',
                      type: 'radio',
                      options: [
                        {
                          label: 'AB (general anaesthesia with recovery)',
                          value: 'ab'
                        },
                        {
                          label: 'AB-L (local anaesthesia)',
                          value: 'abl'
                        },
                        {
                          label: 'AC (non-recovery general anaesthesia)​',
                          value: 'ac'
                        },
                        {
                          label: 'AD (neuromuscular blocking agent)',
                          value: 'ad'
                        }
                      ],
                      className: 'smaller'
                    }
                  },
                  {
                    label: 'No',
                    value: false
                  }
                ],
                conditional: {
                  anaesthesia: true
                }
              },
              {
                name: 'optional',
                label: 'Is this step optional?',
                type: 'radio',
                inline: true,
                className: 'smaller',
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
                      label: 'Yes',
                      value: true,
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
                    {
                      label: 'No',
                      value: false
                    }
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
                  substances: true
                }
              },
              {
                name: 'dosing-regimen',
                label: 'How will you determine an appropriate dosing regimen?​',
                hint: 'Explain how you considered the routes, dose volumes, frequencies, and overall duration of a dosing regimen.',
                type: 'textarea',
                conditional: {
                  substances: true
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
                  {
                    label: 'Kept alive',
                    value: 'kept-alive'
                  },
                  {
                    label: 'Re-used',
                    value: 're-used'
                  },
                  {
                    label: 'Continued use',
                    value: 'continued-use'
                  },
                  {
                    label: 'Set free',
                    value: 'set-free'
                  },
                  {
                    label: 'Re-homed',
                    value: 're-homed'
                  },
                  {
                    label: 'Killed',
                    value: 'killed',
                    reveal: {
                      label: '',
                      review: 'Method of killing',
                      name: 'killing-method',
                      type: 'radio',
                      className: 'smaller',
                      options: [
                        {
                          label: 'Schedule 1 method​',
                          value: 'schedule-1'
                        },
                        {
                          label: 'Non-schedule 1 method​',
                          value: 'other',
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
        nts: true,
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
        nts: true,
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
  otherConsiderations: {
    title: 'Other considerations',
    subsections: {
      nmbas: {
        title: 'Neuromuscular blocking agents (NMBAs)',
        show: values => some(values.protocols, protocol => {
          return some(protocol.steps, step => step.code === 'ad');
        }),
        linkTo: 'protocols',
        steps: [
          {
            title: 'Neuromuscular blocking agents (NMBAs) - 1 of 2',
            fields: [
              {
                name: 'nmbas-why',
                label: 'Why do you need to use NMBAs in your protocols?',
                type: 'texteditor'
              },
              {
                name: 'nmbas-anaesthetic',
                label: 'What anaesthetic and analgesic regime will you use?',
                type: 'texteditor'
              },
              {
                name: 'nmbas-ventilation',
                label: 'How will you ensure that animals have adequate ventilation?',
                type: 'texteditor'
              },
              {
                name: 'nmbas-pain',
                label: 'How will you minimise pain and distress for animals under the influence of an NMBA?',
                type: 'texteditor'
              }
            ]
          },
          {
            title: 'Neuromuscular blocking agents (NMBAs) - 2 of 2',
            fields: [
              {
                name: 'nmbas-depth',
                label: 'How wil you monitor the depth of anaesthesia?',
                type: 'texteditor'
              },
              {
                name: 'nmbas-people',
                label: 'How will you ensure that you have enough people with the right skills involved throughout the process of administering NMBA\'s, including animals recovery periods?',
                type: 'texteditor'
              },
              {
                name: 'nmbas-emergency-routine',
                label: 'Explain the agreed emergency routine at your establishment that covers potential hazardous events (such as a power failure).',
                hint: 'You may want to add a copy of your emergency routine as an attachment.',
                type: 'texteditor'
              }
            ]
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
        nts: true,
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
        nts: true,
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
