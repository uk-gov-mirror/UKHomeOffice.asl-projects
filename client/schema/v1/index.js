import NTSSummary from '../../pages/sections/nts';
import Protocols from '../../pages/sections/protocols';
import ProtocolsReview from '../../pages/sections/protocols/review';
import Objectives from '../../pages/sections/objectives';
import ObjectivesReview from '../../pages/sections/objectives/review';
import Establishments from '../../pages/sections/establishments';
import EstablishmentsReview from '../../pages/sections/establishments/review';
import Poles from '../../pages/sections/poles';
import PolesReview from '../../pages/sections/poles/review';

import SPECIES from '../../constants/species';

import intersection from 'lodash/intersection';
import some from 'lodash/some';
import flatten from 'lodash/flatten';
import castArray from 'lodash/castArray';

export default {
  introduction: {
    title: 'Project introduction',
    subsections: {
      introduction: {
        title: 'Introductory details',
        steps: [
          {
            title: 'Apply for project licence - 1 of 2',
            intro: 'This tool currently supports applications for Research projects. The full range of project licence applications will be added soon.',
            fields: [
              {
                name: 'primary-establishment',
                playback: 'Primary establishment',
                label: 'What is the primary establishment for this project?',
                type: 'radio',
                className: 'smaller',
                optionsFromSettings: 'establishments'
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
                playback: 'Overall aim of this project',
                type: 'texteditor'
              },
              {
                name: 'project-importance',
                label: 'Why is it important to undertake this work?',
                type: 'texteditor'
              },
              {
                name: 'permissible-purpose',
                label: 'Which permissible purposes apply to this project?',
                type: 'checkbox',
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
                          label: '(i) Avoidance, prevention, diagnosis or treatment of disease, ill-health  or abnormality, or their effects, in man, animals or plants.',
                          value: 'translational-research-1',
                        },
                        {
                          label: '(ii) Assessment, detection, regulation or modification of physiological conditions in man, animals or plants.',
                          value: 'translational-research-2'
                        },
                        {
                          label: '(iii) Improvement of the welfare of animals or of the production conditions for animals reared for agricultural purposes.',
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
                    label: '(d) Protection of the natural environment in the interests of the health or welfare of man or animals.',
                    value: 'protection-of-environment'
                  },
                  {
                    label: '(e) Research aimed at preserving the species of animal subjected to regulated procedures as part of the programme of work.',
                    value: 'preservation-of-species'
                  },
                  {
                    label: '(f) Higher education or training for the acquisition, maintenance or improvement of vocational skills.',
                    value: 'higher-education'
                  },
                  {
                    label: '(g) Forensic enquiries.',
                    value: 'forensic-enquiries'
                  }
                ]
              },
              {
                name: 'duration',
                label: 'What will be the duration of this project?',
                type: 'duration'
              },
              {
                name: 'species',
                label: 'Which types of animals will be used in this project?',
                type: 'species-selector',
                summary: true
              }
            ]
          }
        ]
      }
    }
  },
  applicantInformation: {
    title: 'Applicant information',
    subsections: {
      experience: {
        title: 'Experience',
        fields: [
          {
            name: 'experience-projects',
            label: 'Have you managed similar work in this field before?',
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
                  type: 'texteditor'
                }
              },
              {
                label: 'No',
                value: false,
                reveal: [
                  {
                    name: 'experience-knowledge',
                    label: 'What relevant scientific knowledge or education do you have?',
                    type: 'texteditor'
                  },
                  {
                    name: 'experience-animals',
                    label: 'What experience do you have of using the types of animals and experimental models stated in this licence application?',
                    type: 'texteditor'
                  },
                  {
                    name: 'experience-experimental-design',
                    label: 'What experimental design and data analysis training have you had?',
                    hint: 'If you do not have this expertise, how will you access it?',
                    type: 'texteditor'
                  },
                  {
                    name: 'experience-others',
                    label: 'Why are you the most suitable person in the research group, department or company to manage the project?',
                    type: 'texteditor'
                  }
                ]
              }
            ]
          },
          {
            name: 'funding-previous',
            label: 'What relevant expertise and staffing will be available to help you to deliver the programme of work?',
            hint: 'Include examples of practical, technical, and specialist support.',
            type: 'texteditor'
          },
          {
            name: 'other-people',
            label: 'Will other people help you manage the project? If so, how?',
            type: 'texteditor'
          }
        ]
      },
      funding: {
        title: 'Funding',
        fields: [
          {
            name: 'funding-how',
            label: 'How will your project be funded?',
            hint: 'If you do not have full funding, explain how you will stage your work and the likelihood of you obtaining further funding.',
            type: 'texteditor'
          },
          {
            name: 'funding-reviewed',
            label: 'Has this application been peer reviewed by an external funder?',
            type: 'texteditor'
          }
        ]
      }
    }
  },
  projectLocation: {
    title: 'Project location',
    subsections: {
      establishments: {
        title: 'Establishments',
        playback: 'primary-establishment',
        review: EstablishmentsReview,
        steps: [
          {
            fields: [
              {
                name: 'other-establishments',
                label: 'Will your project use any additional establishments?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'other-establishments-list',
                      label: '',
                      type: 'checkbox',
                      className: 'smaller',
                      optionsFromSettings: 'establishments',
                      without: 'primary-establishment',
                      fallbackLink: {
                        url: '/settings',
                        label: 'Please add another establishment'
                      }
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
            show: values => values['other-establishments'] === true && values['other-establishments-list'] && values['other-establishments-list'].length,
            component: Establishments,
            name: 'establishments',
            fields: [
              {
                name: 'establishment-about',
                label: 'Why do you need to carry out work at this establishment?',
                hint: 'For example, there may be important specialised equipment at this location that is not available at your primary establishment.',
                type: 'texteditor',
                repeats: true
              },
              {
                name: 'establishment-supervisor',
                label: 'Who will be responsible for supervising your work at this establishment?',
                type: 'texteditor',
                repeats: true
              }
            ]
          },
          {
            fields: [
              {
                name: 'establishments-care-conditions',
                label: 'Do the housing, husbandry, and care conditions at each establishment meet the requirements laid out in the Code of Practice for each type of animal you will be using?',
                hint: 'Please read the Code of Practice for the housing and care of animals bred, supplied, or used for scientific purposes before you answer.',
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
                      name: 'establishments-care-conditions-justification',
                      label: 'If any of your establishments do not meet these requirements, explain how you will ensure that housing, husbandry, and care conditions are appropriate for your project.',
                      type: 'texteditor'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      'transfer-of-animals': {
        title: 'Transfer and movement of animals',
        show: values => values['other-establishments'] && values['other-establishments-list'] && values['other-establishments-list'].length,
        fields: [
          {
            name: 'transfer',
            label: 'Will any animals be moved between licensed establishments during this project?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'transfer-why',
                    label: 'Why do you need to move animals between licensed establishments?',
                    type: 'texteditor'
                  },
                  {
                    name: 'transfer-how',
                    label: 'How might the movement of animals between licensed establishments affect scientific delivery of the work?',
                    type: 'texteditor'
                  },
                  {
                    name: 'transfer-measures',
                    label: 'What measures will you use to minimise any adverse effects for animals that may arise when moving them between licensed establishments?',
                    type: 'texteditor'
                  },
                  {
                    name: 'transfer-recovery',
                    label: 'Will surgically prepared animals be given a minimum of 7 days to recover before being transferred?',
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
                          name: 'transfer-no-recovery',
                          label: 'Why won\'t animals be given 7 days to recover before being transferred?',
                          type: 'texteditor'
                        }
                      }
                    ]
                  },
                  {
                    name: 'transfer-acclimatisation',
                    label: 'Will animals be given a minimum of 7 days to acclimatise to their new surroundings prior to any regulated procedures being undertaken?',
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
                          name: 'transfer-no-acclimatisation',
                          label: 'Why won\'t  animals be given 7 days to acclimatise to their new surroundings? ',
                          type: 'texteditor'
                        }
                      }
                    ]
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
      poles: {
        title: 'Places other than a licensed establishment (POLEs)',
        review: PolesReview,
        steps: [
          {
            fields: [
              {
                name: 'poles',
                label: 'Will any part of your project be carried out in any places other than a licensed establishment (POLEs)?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'poles-justification',
                      label: 'Why can\'t this part of your project take place at a licensed establishment?',
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
            component: Poles,
            show: values => values.poles === true,
            name: 'polesList',
            fields: [
              {
                name: 'title',
                label: 'Name',
                type: 'text'
              },
              {
                name: 'pole-info',
                label: 'Details',
                type: 'texteditor'
              }
            ]
          },
          {
            show: values => values.poles === true,
            fields: [
              {
                name: 'poles-inspection',
                label: 'How will you ensure that procedures taking place at these POLEs can be inspected?',
                hint: 'For example, how will you obtain consent from landowners?',
                type: 'texteditor'
              },
              {
                name: 'poles-transfer',
                label: 'Will any animals be moved between a POLE and a licensed establishment during this project?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'poles-transfer-justification',
                        label: 'Why do you need to move animals between a POLE and a licensed establishment?',
                        type: 'texteditor'
                      },
                      {
                        name: 'poles-transfer-condition',
                        label: 'How will you ensure that animals are in a suitable condition to be transported?',
                        type: 'texteditor'
                      },
                      {
                        name: 'poles-transfer-responsibility',
                        label: 'Who will be responsible for checking the animals before they are transported?',
                        type: 'texteditor'
                      },
                      {
                        name: 'poles-transfer-checks',
                        label: 'How will you ensure the competence of this person to make the appropriate checks?',
                        type: 'texteditor'
                      },
                      {
                        name: 'poles-transfer-delivery',
                        label: 'How might the movement of animals between a POLE and a licensed establishment affect the scientific delivery of this project?',
                        type: 'texteditor'
                      },
                      {
                        name: 'poles-transfer-measures',
                        label: 'What arrangements will be made to assure an animal\'s welfare during transport, particularly if they are being moved after the start of regulated procedures?',
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
            label: 'Briefly summarise the current state of scientific knowledge in this area of work to show how you arrived at the starting point of this project.',
            hint: 'Be specific and relevant to your project aim - there\'s no need for a detailed overview of the entire field. Include any relevant non-animal research if it has contributed to the starting point of your project.',
            type: 'texteditor'
          },
          {
            name: 'scientific-knowledge-details',
            label: 'What new knowledge do you hope to discover that will address a gap in fundamental scientific knowledge or meet a clinical need?',
            hint: 'Refer to the basis for any scientific hypotheses you plan to test during this project.',
            type: 'texteditor'
          },
          {
            name: 'clinical-condition',
            label: 'Does your project mainly involve translational or veterinary clinical applications?',
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
                    label: 'How prevalent and severe are the relevant clinical conditions?',
                    type: 'texteditor'
                  },
                  {
                    name: 'condition-treatments-problems',
                    label: 'What are the problems with current treatments which mean that further work is necessary?',
                    type: 'texteditor'
                  },
                  {
                    name: 'condition-scientific-approach',
                    label: 'What is the scientific basis for your proposed approach?',
                    type: 'texteditor'
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
            name: 'transfer-expiring',
            label: 'Do you need to transfer animals from an expiring licence as continued use?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'expiring-yes',
                    label: 'Please state the licence number and expiry date of any of these licences.',
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
            name: 'objectives',
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
                label: 'Where relevant, how will you seek to use or develop non-animal alternatives for all or part of your work?',
                type: 'texteditor'
              }
            ]
          }
        ]
      },
      'general-principles': {
        title: 'General principles',
        fields: [
          {
            label: 'Unnecessary duplication of work must be avoided. Under what circumstances would you knowingly duplicate work?',
            name: 'general-principles-duplicate',
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
        ]
      },
      benefits: {
        title: 'Benefits',
        nts: true,
        fields: [
          {
            name: 'benefit-outputs',
            label: 'What outputs do you think you will see at the end of this project?',
            hint: 'Outputs can include new information, publications, or products.',
            type: 'texteditor'
          },
          {
            name: 'benefit-who',
            label: 'Who or what will benefit from these outputs?',
            hint: 'The impact of these outputs may be seen in the short-term, or they may not be fully realised until you\'ve completed the project. Consider all timescales in your answer.',
            type: 'texteditor'
          },
          {
            name: 'benefit-maximise-outputs',
            label: 'How will you look to maximise the outputs of this work?',
            hint: 'For example, collaboration, dissemination of new knowledge, or publication of unsuccessful approaches.',
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
        review: ProtocolsReview,
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
                label: 'Briefly describe the purposes of this protocol',
                hint: 'Include any relevant regulatory guidelines that may apply.',
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
                label: 'Why are you proposing this severity category?',
                type: 'texteditor'
              },
              {
                name: 'locations',
                label: 'Select the establishments or POLEs where this protocol will be carried out.',
                hint: 'Select all that apply.',
                type: 'location-selector'
              },
              {
                name: 'objectives',
                label: 'Which of your objectives will this protocol cover?',
                hint: 'Select all that apply.',
                type: 'objective-selector'
              },
              {
                name: 'outputs',
                label: 'What outputs are expected to arise from this protocol?',
                hint: 'For example, test results, phenotypic information, or products.',
                type: 'texteditor'
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
                  },
                  {
                    label: 'Aged animal',
                    value: 'aged'
                  }
                ]
              },
              {
                name: 'continued-use',
                label: 'Will any animals coming on to this protocol be classed as ‘continued use’?',
                hint: '‘Continued use’ describes animals that have had procedures applied to them in order to be used in a particular protocol. For example, genetically altered animals that have been bred for scientific use.',
                type: 'radio',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'continued-use-sourced',
                      label: 'How did these animals start their use?',
                      hint: 'Describe the procedures that have been applied to animals that will continue their use on to this protocol.',
                      type: 'texteditor'
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
                label: 'Will you be re-using animals on to this protocol?',
                hint: '‘Re-use’ describes using animals again for a new experiment when you could equally use a naïve animal to get the same results.',
                type: 'radio',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: {
                      name: 'reuse-details',
                      label: 'Describe any procedure that may have been applied to these animals, and why you are choosing to re-use them.',
                      type: 'texteditor'
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
                name: 'maximum-times-used',
                label: 'What is the maximum number of times that this protocol will be used on this type of animal?',
                hint: 'Count the number of first time uses of a naive animal, then add this to the number of instances of re-use (if relevant).',
                type: 'text'
              }
            ]
          },
          gaas: {
            title: 'Genetically altered animals (GAA)',
            fields: [
              {
                name: 'gaas',
                label: 'Will this protocol use any genetically altered animals?',
                type: 'radio',
                className: 'smaller',
                inline: true,
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'gaas-types',
                        label: 'Which general types or strains will you be using and why?',
                        type: 'texteditor'
                      },
                      {
                        name: 'gaas-harmful',
                        label: 'Do you expect any of these GAAs to show a harmful phenotype with welfare consequences?',
                        type: 'radio',
                        className: 'smaller',
                        inline: true,
                        options: [
                          {
                            label: 'Yes',
                            value: true,
                            reveal: [
                              {
                                name: 'gaas-harmful-justification',
                                label: 'Why are each of these significant phenotypes scientifically necessary?',
                                type: 'texteditor'
                              },
                              {
                                name: 'gaas-harmful-control',
                                label: 'How will you control the harms associated with these phenotypes?',
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
                  {
                    label: 'No',
                    value: false
                  }
                ]
              }
            ]
          },
          steps: {
            title: 'Steps',
            hint: 'A step can be a single procedure or a combination of procedures to achieve an outcome. You will be able to reorder your steps at any time before you send your application to the Home Office.',
            footer: 'Once you’ve created a list of steps, you need to add information about adverse effects, controls and limitations, and humane endpoints to each one.​',
            fields: [
              {
                name: 'title',
                type: 'texteditor',
                label: 'Describe the procedures that will be carried out during this step.',
                hint: 'To ensure that an adequate harm benefit assessment can be carried out, please provide a clear and explicit explanation of each step.'
              },
              {
                name: 'code',
                label: 'Select the anaesthetic codes that apply to this step.',
                type: 'checkbox',
                options: [
                  {
                    label: 'AA (no anaesthesia)',
                    value: 'aa'
                  },
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
              },
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
                        hint: 'State the signs of each adverse effect, including the likely incidence, and the anticipated degree and duration of suffering.',
                        type: 'texteditor'
                      },
                      {
                        name: 'prevent-adverse-effects',
                        label: 'How will you attempt to prevent any of these adverse effects?​',
                        hint: 'If adverse effects can\'t be prevented, how will you attempt to ameliorate their initial signs?',
                        type: 'texteditor'
                      },
                      {
                        name: 'endpoints',
                        label: 'What are the humane endpoints for this step?',
                        hint: 'This would be the point at which you would kill the animal to prevent further suffering.',
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
          experience: {
            title: 'Animal experience',
            fields: [
              {
                name: 'experience-summary',
                label: 'Summarise the overall severity of the experience of an animal being used in this protocol.',
                hint: 'This may be different to the severity category of the project that you are proposing.',
                type: 'texteditor'
              },
              {
                name: 'experience-proportion',
                label: 'What is the approximate proportion of animals being used in this protocol that you expect to suffer the most?',
                hint: 'When determining higher levels of severity, consider the cumulative effect of any combinations of procedures that you may carry out in the protocol.',
                type: 'texteditor'
              },
              {
                name: 'experience-endpoints',
                label: 'Describe any general humane endpoints that you may apply during the protocol.',
                hint: 'These will be in addition to the endpoints stated for each step.',
                type: 'texteditor'
              }
            ]
          },
          experimentalDesign: {
            title: 'Experimental design',
            fields: [
              {
                name: 'quantitative-data',
                label: 'Will this protocol generate quantitative data?',
                type: 'radio',
                className: 'smaller',
                inline: true,
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'quantitative-data-guideline',
                        label: 'Will your experimental design be determined by a regulatory guideline or similar?',
                        type: 'radio',
                        className: 'smaller',
                        inline: true,
                        options: [
                          {
                            label: 'Yes',
                            value: true,
                            reveal: {
                              name: 'quantitative-data-guideline-refined',
                              label: 'How will you ensure that you are using the most refined methodology?',
                              type: 'texteditor'
                            }
                          },
                          {
                            label: 'No',
                            value: false,
                          }
                        ]
                      }
                    ]
                  },
                  {
                    label: 'No',
                    value: false,
                    reveal: {
                      name: 'quantitative-data-pilot-studies',
                      label: 'Will this protocol use pilot studies',
                      type: 'radio',
                      className: 'smaller',
                      inline: true,
                      options: [
                        {
                          label: 'Yes',
                          value: true,
                          reveal: {
                            name: 'quantitative-data-pilot-studies-how',
                            label: 'How and when will you use pilot studies?',
                            type: 'texteditor'
                          }
                        },
                        {
                          label: 'No',
                          value: false,
                          reveal: [
                            {
                              name: 'quantitative-data-experimental-groups',
                              label: 'How will you choose different experimental groups?',
                              type: 'texteditor'
                            },
                            {
                              name: 'control-groups',
                              label: 'How will you use control groups?',
                              hint: 'Provide a robust scientific justification for controls with significant suffering such as sham surgery controls or untreated infected controls.',
                              type: 'texteditor'
                            },
                            {
                              name: 'randomised',
                              label: 'Will experiments and data analysis in this protocol be randomised or blinded? If so, how?',
                              type: 'texteditor'
                            },
                            {
                              name: 'reproducibility',
                              label: 'How will you minimise variables to ensure reproducibility?',
                              type: 'texteditor'
                            },
                            {
                              name: 'control-groups-size',
                              label: 'How will you determine group sizes?',
                              type: 'texteditor'
                            },
                            {
                              name: 'maximize-effectiveness',
                              label: 'How will you maximise the data output from the animals you use on this protocol?',
                              type: 'texteditor'
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          },
          justification: {
            title: 'Protocol justification',
            label: 'Why is each type of animal and experimental model proposed in this protocol',
            fields: [
              {
                name: 'most-appropriate',
                label: 'a) the best scientifically?​',
                type: 'texteditor'
              },
              {
                name: 'most-refined',
                label: 'b) the most refined for the purpose?',
                type: 'texteditor'
              },
              {
                name: 'scientific-endpoints',
                label: 'What is the scientific need for the expected clinical signs for each experimental model in this protocol?',
                type: 'texteditor'
              },
              {
                name: 'scientific-suffering',
                label: 'Why scientifically do the animals need to suffer to this degree?',
                type: 'texteditor'
              },
              {
                name: 'scientific-endpoints-justification',
                label: 'Why can\'t you achieve your scientific outputs with an earlier humane endpoint, or without animals showing any clinical signs?',
                type: 'texteditor'
              },
              {
                name: 'minimise-duration',
                label: 'How will you minimise the duration and intensity of suffering for animals in this protocol?',
                hint: 'For example, monitoring animals appropriately over the course of the experiment.',
                type: 'texteditor'
              },
              {
                name: 'justification-substances',
                label: 'Will you be administering substances for testing that will alter an animal’s physiology during this project?',
                type: 'radio',
                className: 'smaller',
                inline: true,
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'substances-suitibility',
                        label: 'How will you assess the suitability of substances given to the particular strain or type of animal you will be using?',
                        type: 'texteditor'
                      },
                      {
                        name: 'dosing-regimen',
                        label: 'How will you determine an appropriate dosing regimen?​',
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
                    label: 'Killed',
                    value: 'killed',
                    reveal: {
                      label: '',
                      review: 'Method of killing',
                      name: 'killing-method',
                      type: 'checkbox',
                      className: 'smaller',
                      options: [
                        {
                          label: 'Schedule 1 method​',
                          value: 'schedule-1'
                        },
                        {
                          label: 'Non-schedule 1 killing of a conscious animal',
                          value: 'other',
                          reveal: {
                            name: 'method-and-justification',
                            label: 'For each method, explain why this is scientifically necessary and how you will ensure that suffering is minimised.',
                            type: 'texteditor'
                          }
                        }
                      ]
                    }
                  },
                  {
                    label: 'Kept alive',
                    value: 'kept-alive'
                  },
                  {
                    label: 'Continued use on another protocol',
                    value: 'continued-use',
                    reveal: {
                      name: 'continued-use-relevant-project',
                      label: 'Please state the relevant project and protocol.',
                      type: 'texteditor'
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
            name: 'project-harms-animals',
            label: 'Explain why you are using these types of animals and your choice of life stages.',
            type: 'texteditor'
          },
          {
            name: 'project-harms-summary',
            label: 'Typically, what will be done to an animal used in your project?',
            hint: 'For example, injections and procedures. Include any relevant information about the duration of experiments and the number of procedures.',
            type: 'texteditor'
          },
          {
            name: 'project-harms-effects',
            label: 'What are the expected impacts or adverse effects for an animal during your project?',
            hint: 'Examples can include pain, inactivity, or abnormal behaviour. State the estimated duration of these effects on an animal.',
            type: 'texteditor'
          },
          {
            name: 'project-harms-severity',
            label: 'What are the expected severities and the proportion of animals in each category (per animal type)?',
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
            type: 'checkbox',
            className: 'smaller',
            options: [
              {
                label: 'Kept alive',
                value: 'kept-alive',
                reveal: [
                  {
                    name: 'kept-alive-animals',
                    label: 'What types of animals will you keep alive?',
                    type: 'texteditor'
                  },
                  {
                    name: 'keeping-animals-alive-determine',
                    label: 'What criteria will the veterinary surgeon use to determine whether animals can be kept alive?',
                    type: 'texteditor'
                  },
                  {
                    name: 'keeping-animals-alive-supervised',
                    label: 'Are there any limitations on the period of time that animals that have been kept alive can be held under the supervision of the veterinary surgeon?',
                    type: 'texteditor'
                  }
                ]
              },
              {
                label: 'Set free',
                value: 'set-free',
                reveal: [
                  {
                    name: 'setting-free-health',
                    label: 'How will an animal\'s health be assessed to determine whether it can be set free?',
                    type: 'texteditor'
                  },
                  {
                    name: 'setting-free-vet',
                    label: 'Will a veterinary surgeon perform this assessment?',
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
                          name: 'setting-free-competence',
                          label: 'How will you ensure the competence of the person responsible for assessing whether animals can be set free?',
                          type: 'texteditor'
                        }
                      }
                    ]
                  },
                  {
                    name: 'setting-free-ensure-not-harmful',
                    label: 'How will you ensure that setting animals free will not be harmful to other species, the environment, and human health?',
                    type: 'texteditor'
                  },
                  {
                    name: 'setting-free-rehabilitate',
                    label: 'Will you attempt to rehabilitate animals before setting them free? If so, how?',
                    type: 'texteditor'
                  },
                  {
                    name: 'setting-free-socialise',
                    label: 'Will you attempt to socialise any animals that you have set free? If so, how?',
                    type: 'texteditor'
                  },
                  {
                    name: 'setting-free-wellbeing',
                    label: 'What arrangements will be made to assure their welfare during transport, particularly if they are being moved after the start of regulated procedures?',
                    type: 'texteditor'
                  },
                  {
                    name: 'setting-free-recapturing',
                    label: 'What is the likelihood of inadvertently re-capturing and re-using animals that have been set free?',
                    type: 'texteditor'
                  },
                  {
                    name: 'setting-free-lost',
                    label: 'If animals are lost to the study or not re-captured, how will you determine whether your project is complete?',
                    hint: 'This information is important to ensure that the use of these animals is recorded in the return of procedures, and is considered when determining the actual severity of your protocols.',
                    type: 'texteditor'
                  }
                ]
              },
              {
                label: 'Rehomed',
                value: 'rehomed',
                reveal: [
                  {
                    name: 'rehoming-types',
                    label: 'What types of animals do you intend to re-home?',
                    hint: 'Also state the protocols on which they will have been used.',
                    type: 'texteditor'
                  },
                  {
                    name: 'rehoming-healthy',
                    label: 'How will you make sure that an animal’s health allows it to be rehomed?',
                    type: 'texteditor'
                  },
                  {
                    name: 'rehoming-harmful',
                    label: 'How will you ensure that rehoming does not pose a danger to public health, animal health, or the environment?',
                    type: 'texteditor'
                  },
                  {
                    name: 'rehoming-socialisation',
                    label: 'What scheme is in place to ensure socialisation when an animal is rehomed?',
                    type: 'texteditor'
                  },
                  {
                    name: 'rehoming-other',
                    label: 'What other measures will you take to safeguard an animal’s wellbeing when it is rehomed?',
                    type: 'texteditor'
                  }
                ]
              },
              {
                label: 'Used in other projects',
                value: 'used-in-other-projects'
              }
            ]
          }
        ]
      }
    }
  },
  useOfAnimals: {
    title: 'Use of animals',
    subsections: {
      domestic: {
        title: 'Cats, dogs, and equidae',
        intro: 'You are seeing this section because you added a type of cat, dog, or equid to your project. To change this, go to Introductory details.',
        show: values => intersection(
          flatten([
            SPECIES.CAT,
            SPECIES.DOG,
            SPECIES.EQU
          ]).map(s => s.value),
          values.species
        ).length,
        fields: [
          {
            name: 'domestic',
            label: 'What are the scientific reasons for using cats, dogs, or equidae in your project?',
            type: 'texteditor'
          }
        ]
      },
      nhps: {
        title: 'Non-human primates',
        intro: 'You are seeing this section because you added a non-human primate to your project. To change this, go to Introductory details.',
        show: values => intersection(SPECIES.NHP.map(s => s.value), values.species).length,
        fields: [
          {
            name: 'nhps',
            label: 'Why do you need to use non-human primates to achieve your objectives?',
            type: 'texteditor'
          },
          {
            name: 'nhps-justification',
            label: 'Explain how the project is for one of the permitted reasons.',
            hint: `The permitted reasons for the use of non-human primates are:

* basic research
* translational or applied research for the avoidance, prevention, diagnosis or treatment of debilitating or potentially life-threatening clinical conditions or their effects in man
* the development, manufacture or testing of the quality, effectiveness and safety of drugs for the avoidance, prevention, diagnosis or treatment of debilitating or potentially life-threatening clinical conditions or their effects in man
* research aimed at preserving the species of animal subjected to regulated procedures`,
            type: 'texteditor'
          },
          {
            name: 'wild-caught-primates',
            label: 'Might any of these non-human primates be wild-caught?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: {
                  name: 'wild-caught-primates-justification',
                  label: 'Why can\'t you achieve your objectives without using wild-caught primates?',
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
            name: 'marmoset-colony',
            label: 'Will all marmosets be sourced from a self-sustaining colony?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            show: values => (values.species || []).includes('marmosets'),
            options: [
              {
                label: 'Yes',
                value: true
              },
              {
                label: 'No',
                value: false,
                reveal: {
                  name: 'marmoset-colony-justification',
                  label: 'Why can’t you achieve your objectives without using marmosets from a self-sustaining colony?',
                  type: 'texteditor'
                }
              }
            ]
          }
        ]
      },
      'purpose-bred-animals': {
        title: 'Purpose bred animals',
        fields: [
          {
            name: 'purpose-bred',
            label: 'Will all animals used in your project be purpose bred?',
            hint: 'This means animals that have been bred primarily to be used in regulated procedures or for the use of their tissues or organs for scientific purposes.',
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
                reveal: [
                  {
                    name: 'purpose-bred-sourced',
                    label: 'Where will you source animals from that have not been purpose bred?',
                    type: 'texteditor'
                  },
                  {
                    name: 'purpose-bred-justification',
                    label: 'Why can’t you achieve your objectives by only using purpose bred animals?',
                    type: 'texteditor'
                  }
                ]
              }
            ]
          }
        ]
      },
      'endangered-animals': {
        title: 'Endangered animals',
        fields: [
          {
            name: 'endangered-animals',
            label: 'Will you be using any endangered animals?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'endangered-animals-justification',
                    label: 'Why can’t you achieve your objectives without using endangered animals?',
                    type: 'texteditor'
                  },
                  {
                    name: 'endangered-animals-permitted',
                    label: 'Explain how the project is for one of the permitted reasons.',
                    hint: `The permitted reasons for the use of endangered animals are:

  * translational or applied research for the avoidance, prevention, diagnosis or treatment of disease, ill-health or other abnormality, or their effects, in man, animals or plants
  * the development, manufacture or testing of the quality, effectiveness and safety of drugs, feed-stuffs or any other substances or products for the avoidance, prevention, diagnosis or treatment of disease, ill-health or other abnormality, or their effects, in man, animals or plants or assessment, detection, regulation or modification of physiological conditions in man, animals or plants or the improvement of the welfare of animals or of the production conditions for animals reared for  agricultural purposes
  * research aimed at the preservation of the species`,
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
      'animals-taken-from-the-wild': {
        title: 'Animals taken from the wild',
        steps: [
          {
            title: 'Animals taken from the wild - 1 of 2',
            fields: [
              {
                name: 'wild-animals',
                label: 'Will you be using any animals taken from the wild?',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'wild-animals-justification',
                        label: 'Why can’t you achieve your objectives without using animals taken from the wild?',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-caught',
                        label: 'How will these animals be captured?',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-potential-harms',
                        label: 'How will you minimise potential harms when catching these animals?',
                        type: 'texteditor'
                      },
                      {
                        name: 'non-target-species-capture-methods',
                        label: 'Will your capture methods catch non target species?',
                        type: 'radio',
                        inline: true,
                        className: 'smaller',
                        options: [
                          {
                            label: 'Yes',
                            value: true,
                            reveal: {
                              name: 'non-target-species-capture-methods-minimise-suffering',
                              label: 'How will you manage this to minimise the suffering for the animal?',
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
                        name: 'wild-animals-competence',
                        label: 'How will you ensure the competence of any person responsible for the capture of animals?',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-examine',
                        label: 'How will you examine and treat any animals that are found to be ill or injured at the time of capture?',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-vet',
                        label: 'Will a veterinary surgeon perform the examination?',
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
                              name: 'wild-animals-vet-competence',
                              label: 'How will you ensure the competence of the person responsible for making this assessment?',
                              type: 'texteditor'
                            }
                          }
                        ]
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
          {
            title: 'Animals taken from the wild - 2 of 2',
            show: values => values['wild-animals'] === true,
            fields: [
              {
                name: 'wild-animals-transport',
                label: 'If sick animals are to be treated, how will you transport them to minimise harms if necessary to provide treatment?',
                type: 'texteditor'
              },
              {
                name: 'wild-animals-killing-method',
                label: 'If sick animals are to be killed, which method will you use?',
                type: 'texteditor'
              },
              {
                name: 'wild-animals-identify',
                label: 'How will animals be identified?',
                type: 'texteditor'
              },
              {
                name: 'wild-animals-devices',
                label: 'If devices are being used, will they remain attached to or implanted in animals?',
                hint: 'For example, any device used to identify, track, and monitor an animal’s behaviour in its natural habitat.',
                type: 'radio',
                inline: true,
                className: 'smaller',
                options: [
                  {
                    label: 'Yes',
                    value: true,
                    reveal: [
                      {
                        name: 'wild-animals-devices-effects',
                        label: 'How will any adverse effect from the device\'s attachment or implantation be minimised?',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-devices-removal',
                        label: 'How will you locate and recapture the animals or otherwise ensure the devices are removed at the end of the regulated procedures?',
                        hint: 'If devices will not be removed, explain why it is not required.',
                        type: 'texteditor'
                      },
                      {
                        name: 'wild-animals-devices-environment-effects',
                        label: 'What is the potential effect on the animals, other animals, the environment and human health if the devices cannot be removed?',
                        type: 'texteditor'
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
                name: 'wild-animals-declaration',
                label: '',
                type: 'checkbox',
                className: 'smaller',
                options: [
                  {
                    label: 'I confirm that I have, or will have, all necessary permissions from other regulators in place before commencing any work involving animals taken from the wild.',
                    value: 'yes'
                  }
                ]
              }
            ]
          }
        ]
      },
      'feral-animals': {
        title: 'Feral animals',
        fields: [
          {
            name: 'feral-animals',
            label: 'Will you be using any feral animals in your project?',
            hint: 'A feral animal is an animal living in the wild but descended from domesticated individuals.',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'feral-animals-justification',
                    label: 'Why can\'t you use non-feral animals to achieve your objectives?',
                    type: 'texteditor'
                  },
                  {
                    name: 'feral-animals-essential',
                    label: 'Why is the use of feral animals essential to protect the health or welfare of that species or to avoid a serious threat to human or animal health or the environment?',
                    type: 'texteditor'
                  },
                  {
                    name: 'feral-animals-procedures',
                    label: 'Which procedures will be carried out on feral animals? And under which protocols?',
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
      }
    }
  },
  otherConsiderations: {
    title: 'Other considerations',
    subsections: {
      nmbas: {
        title: 'Neuromuscular blocking agents (NMBAs)',
        show: values => some(values.protocols, protocol => {
          return some(protocol.steps, step => step.code && step.code.includes('ad'));
        }),
        linkTo: 'protocols',
        steps: [
          {
            title: 'Neuromuscular blocking agents (NMBAs) - 1 of 2',
            intro: 'You are seeing this section because you will be using an NMBA during your project. To change this, go to Protocols.',
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
                label: 'How will you minimise pain, suffering, and distress for an animal under the influence of an NMBA?',
                type: 'texteditor'
              }
            ]
          },
          {
            title: 'Neuromuscular blocking agents (NMBAs) - 2 of 2',
            intro: 'You are seeing this section because you will be using an NMBA during your project. To change this, go to Protocols.',
            fields: [
              {
                name: 'nmbas-depth',
                label: 'How will you monitor the depth of anaesthesia?',
                type: 'texteditor'
              },
              {
                name: 'nmbas-people',
                label: 'How will you ensure there are sufficient staff present who are competent to use NMBAs in these types of animal?',
                hint: 'This also includes recovery periods.',
                type: 'texteditor'
              },
              {
                name: 'nmbas-emergency-routine',
                label: 'Explain the agreed emergency routine at your establishment that covers potential hazardous events (such as a power failure).',
                type: 'texteditor'
              }
            ]
          }
        ]
      },
      'reusing-animals': {
        title: 'Re-using animals',
        fields: [
          {
            name: '',
            label: 'Will you be re-using animals?',
            type: 'radio',
            className: 'smaller',
            inline: true,
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: [
                  {
                    name: 'reusing-which',
                    label: 'What types of animals will you be re-using?',
                    type: 'texteditor'
                  },
                  {
                    name: 'reusing-why',
                    label: 'Why do you intend to re-use animals?',
                    hint: 'Explain how you balanced the needs of refining and reducing animal use before making your decision.',
                    type: 'texteditor'
                  },
                  {
                    name: 'reusing-limitations',
                    label: 'What are the relevant limitations on re-using animals for this project?',
                    hint: 'For example, there may be a maximum number of times that an animal can be re-used, or a set of performance standards that requires a limit on re-use.',
                    type: 'texteditor'
                  }
                ]
              }
            ]
          }
        ]
      },
      'commercial-slaughter': {
        title: 'Commercial slaughter',
        fields: [
          {
            name: 'commercial-slaughter',
            label: 'Will you send any farm animals to a commercial slaughterhouse at the end of their use?',
            type: 'radio',
            inline: true,
            className: 'smaller',
            options: [
              {
                label: 'Yes',
                value: true,
                reveal: {
                  name: 'commercial-slaughter-hygiene',
                  label: 'How will you ensure that these animals are healthy and meet commercial standards for meat hygiene?',
                  hint: 'Include any relevant information about drug withdrawal times.',
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
      'containing-human-material': {
        title: 'Animals containing human material',
        fields: [
          {
            name: 'animals-containing-human-material',
            label: 'Do you intend to use animals containing human material in experiments classed as Category 2 or 3 by the Academy of Medical Sciences?',
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
        ]
      }
    }
  },
  threeRs: {
    title: 'The 3Rs',
    subsections: {
      replacement: {
        title: 'Replacement',
        playback: 'project-aim',
        reviewTitle: '3Rs: Replacement',
        nts: true,
        fields: [
          {
            name: 'replacement-why',
            label: 'Why do you need to use animals to achieve the aim of your project?',
            type: 'texteditor'
          },
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
            label: 'Enter the estimated number of animals of each type used in this project.',
            type: 'animal-quantities'
          },
          {
            name: 'reduction-estimation',
            label: 'How have you estimated the numbers of animals you will use?',
            hint: 'For example, you may have made some power calculations or carried out some statistical modelling.',
            type: 'texteditor'
          },
          {
            name: 'reduction-steps',
            label: 'What steps did you take during the experimental design phase to reduce the number of animals being used in this project?',
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
            label: 'Which animal models and methods will you use during this project?',
            hint: 'Explain why these models and methods cause the least pain, suffering, distress, or lasting harm to the animals.',
            type: 'texteditor'
          },
          {
            name: 'refinement-explaination',
            label: 'How will you refine the methods and procedures you\'re using as this project progresses?',
            hint: 'Potential refinements include increased monitoring, post-operative care, pain management, and training of animals.',
            type: 'texteditor'
          },
          {
            name: 'refinement-published-guidance',
            label: 'What published best practice guidance will be followed to ensure experiments are conducted in most refined way?',
            type: 'texteditor'
          }
        ]
      }
    }
  },
  nts: {
    title: 'Non-technical summary',
    name: 'nts',
    subsections: {
      'nts-review': {
        title: 'Review',
        component: NTSSummary,
        sections: [
          {
            section: 'introduction',
            title: 'Aim and duration',
            fields: [
              'project-aim',
              'project-importance',
              'duration'
            ]
          },
          {
            section: 'benefits',
            title: 'Benefits'
          },
          {
            section: 'project-harms',
            title: 'Anticipated harms'
          },
          {
            section: 'fate-of-animals',
            title: 'Fate of animals'
          },
          {
            section: 'replacement',
            title: 'Replacement'
          },
          {
            section: 'reduction',
            title: 'Reduction'
          },
          {
            section: 'refinement',
            title: 'Refinement'
          }
        ]
      }
    }
  }
}
