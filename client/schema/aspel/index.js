import Establishments from '../../pages/sections/establishments';
import EstablishmentsReview from '../../pages/sections/establishments/review';
import Protocols from '../../pages/sections/protocols';

export default {
  introductions: {
    title: 'Project introduction',
    subsections: {
      introduction: {
        title: 'Introductory details',
        fields: [
          {
            label: 'Project title',
            name: 'title',
            type: 'text'
          },
          {
            name: 'primary-establishment',
            playback: 'Primary establishment',
            label: 'What is the primary establishment for this project?',
            type: 'radio',
            className: 'smaller',
            optionsFromSettings: 'establishments'
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
                label: 'Why do you need to use this secondary establishment?',
                type: 'texteditor',
                repeats: true
              },
              {
                name: 'establishment-supervisor',
                label: 'Who will supervise work at this secondary establishment?',
                type: 'texteditor',
                repeats: true
              }
            ]
          }
        ]
      },
      poles: {
        title: 'Places other than a licensed establishment (POLES)',
        fields: [
          {
            name: 'poles-list',
            label: 'List the POLEs where you intend to carry out regulated procedures.',
            type: 'texteditor'
          },
          {
            name: 'poles-justification',
            label: 'Why do you need to carry out regulated procedures at these POLEs.',
            type: 'texteditor'
          }
        ]
      }
    }
  },
  scientificBackground: {
    title: 'Scientific background',
    subsections: {
      background: {
        title: 'Background',
        fields: [
          {
            name: 'background',
            label: 'What is the current state of knowledge or product availability on which the proposed project intends to build?',
            type: 'texteditor'
          }
        ]
      },
      benefits: {
        title: 'Benefits',
        fields: [
          {
            name: 'benefits',
            label: 'What are the expected benefits of your programme of work? Why are these benefits worthwhile?',
            type: 'texteditor'
          }
        ]
      },
      references: {
        title: 'References',
        fields: [
          {
            name: 'references',
            label: 'List up to 10 key references that support the need for your proposed project, or refer to any specific models that you propose using.',
            type: 'texteditor'
          }
        ]
      }
    }
  },
  programmeOfWork: {
    title: 'Programme of work',
    subsections: {
      purpose: {
        title: 'Purpose',
        fields: [
          {
            name: 'purpose',
            label: 'Which purposes apply to your project?',
            type: 'texteditor'
          }
        ]
      },
      aims: {
        title: 'Aims and objectives',
        fields: [
          {
            name: 'aims',
            label: 'What do you aim to achieve, establish, or produce by undertaking the proposed programme of work?',
            type: 'texteditor'
          }
        ]
      },
      plan: {
        title: 'Project plan',
        fields: [
          {
            name: 'plan',
            label: 'Provide an overview of the project.',
            type: 'texteditor'
          }
        ]
      },
      replacement: {
        title: 'Replacement',
        fields: [
          {
            name: 'replacement',
            label: 'Why is it not possible to achieve your objectives without using animals?',
            type: 'texteditor'
          }
        ]
      },
      reduction: {
        title: 'Reduction',
        fields: [
          {
            name: 'reduction',
            label: 'How will you ensure that the number of animals used in this project will be kept to a minimum?',
            type: 'texteditor'
          }
        ]
      },
      refinement: {
        title: 'Refinement',
        fields: [
          {
            name: 'refinement',
            label: 'Why are your choices of animal, model, and method the most refined for the intended purpose?',
            type: 'texteditor'
          }
        ]
      },
      origin: {
        title: 'Origin',
        fields: [
          {
            name: 'origin',
            label: 'List the likely origins of animals that will be used in this project.',
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
        component: Protocols,
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
                name: 'severity',
                label: 'Severity category',
                type: 'text'
              }
            ]
          },
          animals: {
            title: 'Type of animals',
            fields: [
              {
                name: 'genetically-altered',
                label: 'Are some of these animals genetically altered?',
                type: 'radio',
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
                name: 'quantity',
                label: 'Estimated number of animals',
                type: 'text'
              },
              {
                name: 'life-stages',
                label: 'Life stage of the animals',
                type: 'text'
              }
            ]
          },
          continuedReuse: {
            title: 'Continued use/re-use',
            fields: [
              {
                name: 'continued-use',
                label: 'Describe what has been done to any animals that can be classed as',
                hint: 'a) Continued use',
                type: 'texteditor'
              },
              {
                name: 'reuse',
                label: '',
                hint: 'b) Re-use',
                type: 'texteditor'
              }
            ]
          },
          'protocol-steps': {
            title: 'Steps',
            fields: [
              {
                name: 'steps',
                label: 'Steps in this protocol',
                type: 'texteditor'
              }
            ]
          },
          fate: {
            title: 'Fate of animals',
            fields: [
              {
                name: 'fate',
                label: 'Fate of animals not killed at the end of the protocol',
                type: 'checkbox',
                className: 'smaller',
                options: [
                  {
                    label: 'Continued use in another protocol',
                    value: 'continued-use'
                  },
                  {
                    label: 'Kept alive at the establishment',
                    value: 'kept-alive'
                  },
                  {
                    label: 'Set fee/re-homed',
                    value: 'set-free'
                  }
                ]
              },
              {
                name: 'fate-justification',
                label: 'Give more details about the fate of animals that you are proposing.',
                type: 'texteditor'
              }
            ]
          },
          adverseEffects: {
            title: 'Adverse effects',
            fields: [
              {
                name: 'adverse-effects',
                label: 'Describe the likely adverse effects and the expected incidence in the different animals used.',
                type: 'texteditor'
              }
            ]
          }
        }
      }
    }
  },
  specialConsiderations: {
    title: 'Special considerations',
    subsections: {
      domestic: {
        title: 'Cats, dogs, primates, and equidae',
        fields: [
          {
            name: 'domestic',
            label: 'Explain why no other species is either suitable for the purpose or practically available.',
            type: 'texteditor'
          }
        ]
      },
      endangered: {
        title: 'Endangered animals',
        fields: [
          {
            name: 'endangered',
            label: 'Explain why the programme of work cannot be achieved without using endangered animals.',
            type: 'texteditor'
          }
        ]
      },
      wild: {
        title: 'Animals taken from the wild',
        fields: [
          {
            name: 'wild',
            label: 'Why can’t your aims and objectives be achieved without using animals taken from the wild. How will you minimize harms that arise during their capture and release?',
            type: 'texteditor'
          }
        ]
      },
      marmosets: {
        title: 'Marmosets',
        fields: [
          {
            name: 'marmosets',
            label: 'Why can’t you achieve your aims and objectives without using marmosets that have been bred in captivity or obtained from a self-sustaining colony?',
            type: 'texteditor'
          }
        ]
      },
      feral: {
        title: 'Feral animals',
        fields: [
          {
            name: 'feral',
            label: 'Why can’t you achieve your aims and objectives without using feral animals of a domestic species?',
            type: 'texteditor'
          }
        ]
      },
      nmbas: {
        title: 'Neuromuscular blocking agents (NMBAs)',
        fields: [
          {
            name: 'nmbas',
            label: 'Detail the use of NMBAs in any part of this project?',
            type: 'texteditor'
          }
        ]
      },
      continuation: {
        title: 'Continuation of work',
        fields: [
          {
            name: 'continuation',
            label: 'If you are seeking authority to continue work from another project licence, provide the relevant licence number and expiry date.',
            type: 'texteditor'
          }
        ]
      }
    }
  },
  nts: {
    title: 'Non-technical summary',
    subsections: {
      summary: {
        title: 'Project summary',
        fields: [
          {
            name: 'nts-title',
            label: 'Title',
            type: 'text'
          },
          {
            name: 'nts-purpose',
            label: 'Purpose',
            type: 'text'
          },
          {
            name: 'nts-duration',
            label: 'Duration',
            type: 'text'
          },
          {
            name: 'nts-objectives',
            label: 'Describe the aims and objectives of the project.',
            type: 'texteditor'
          },
          {
            name: 'nts-benefits',
            label: 'What are the potential benefits that will derive from this project?',
            type: 'texteditor'
          },
          {
            name: 'nts-numbers',
            label: 'What types and approximate numbers of animals will you use over the course of this project?',
            type: 'texteditor'
          },
          {
            name: 'nts-adverse-effects',
            label: 'What are the expected adverse effects and endpoints for animals used in this project?',
            type: 'texteditor'
          }
        ]
      },
      replacement: {
        title: 'Replacement',
        fields: [
          {
            name: 'nts-replacement',
            label: 'Why can’t your project use non-animal alternatives?',
            type: 'texteditor'
          }
        ]
      },
      reduction: {
        title: 'Reduction',
        fields: [
          {
            name: 'nts-reduction',
            label: 'How will you ensure that the number of animals used will be kept to a minimum?',
            type: 'texteditor'
          }
        ]
      },
      refinement: {
        title: 'Refinement',
        fields: [
          {
            name: 'nts-refinement',
            label: 'Why are your choices of animal, model, and method the most refined?',
            type: 'texteditor'
          }
        ]
      }
    }
  }
}
