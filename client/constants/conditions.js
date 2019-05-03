import some from 'lodash/some';
import intersection from 'lodash/intersection';
import SPECIES from './species';

const hasSpecies = (species, values) => intersection(SPECIES[species].map(s => s.value), values.species).length;

export default {
  protocol: {
    nmbas: {
      include: protocol => some(protocol.steps, step => (step.code || []).includes('ad')),
      versions: [
        {
          title: 'NMBAa',
          content: 'All work under authority of this licence involving the use of neuromuscular blocking agents must be carried out in accordance with the Home Office guidelines'
        }
      ]
    },
    cats: {
      include: protocol => hasSpecies('CAT', protocol),
      versions: [
        {
          title: 'Cats',
          content: 'ASRU, on behalf of the Secretary of State, has verified that the necessary additional conditions required for authorising the use of cats on this protocol, outlined in Animals (Scientific Procedures) Act 1986 section 5C(4), have been met.'
        }
      ]
    },
    dogs: {
      include: protocol => hasSpecies('DOG', protocol),
      versions: [
        {
          title: 'Dogs',
          content: 'ASRU, on behalf of the Secretary of State, has verified that the necessary additional conditions required for authorising the use of dogs on this protocol, outlined in Animals (Scientific Procedures) Act 1986 section 5C(4), have been met.'
        }
      ]
    },
    equidae: {
      include: protocol => hasSpecies('EQU', protocol),
      versions: [
        {
          title: 'Equidae',
          content: 'ASRU, on behalf of the Secretary of State, has verified that the necessary additional conditions required for authorising the use of equidae on this protocol, outlined in Animals (Scientific Procedures) Act 1986 section 5C(4), have been met.'
        }
      ]
    },
    nhps: {
      include: protocol => hasSpecies('NHP', protocol),
      versions: [
        {
          title: 'NHPs',
          content: 'ASRU, on behalf of the Secretary of State, has verified that the necessary additional conditions required for authorising the use of non-human primates on this protocol, outlined in Animals (Scientific Procedures) Act 1986 section 5C(4), have been met.'
        }
      ]
    },
    marmosets: {
      include: protocol => (protocol.species || []).includes('marmosets'),
      versions: [
        {
          title: 'Marmosets',
          content: 'ASRU, on behalf of the Secretary of State, considers that an exception to Schedule 2C Part 3 of the Animals (Scientific Procedures) Act 1986 is justified for this protocol, meaning specifically that marmosets that are not offspring of animals bred in captivity, or have been obtained from a self-sustaining colony, can be used.'
        }
      ]
    },
    poles: {
      include: (protocol, project) => intersection(protocol.locations, (project.polesList || []).map(pole => pole.title)).length,
      versions: [
        {
          title: 'POLEs',
          content: 'The assigned inspector must be notified before starting any procedures at a place other than a licensed establishment (POLE) authorised under this licence, in order that the inspector may be present if she or he wishes. The minimum period of notice to be given, the information to be provided and the means of notification must be agreed in writing with the Inspector at least 7 days before regulated procedures at a POLE are started.'
        }
      ]
    },
    reuse: {
      include: protocol => (protocol.fate || []).includes('reuse'),
      versions: [
        {
          title: 'Re-use',
          content: 'Any animal that has completed a series of procedures under the authority of another project licence, and has been kept alive under the supervision of the NVS, may be re-used in this procedure in accordance with the criteria specified in the project plan and with ASPA section 14.'
        }
      ]
    },
    'continued-use': {
      // TODO: confirm this condition and content
      include: protocol => (protocol.fate || []).includes('continued-use'),
      versions: [
        {
          title: 'Continued use',
          content: 'Lorem ipsum'
        }
      ]
    }
  },
  project: {
    endangered: {
      include: project => project['endangered-animals'],
      versions: [
        {
          title: 'Endangered species',
          content: 'ASRU, on behalf of the Secretary of State, has verified that the necessary additional conditions required for authorising the use of endangered species in this project, outlined in Animals (Scientific Procedures) Act 1986 section 5C(4), have been met.'
        }
      ]
    },
    wild: {
      include: project => project['wild-animals'],
      versions: [
        {
          title: 'Animals taken from the wild',
          content: 'ASRU, on behalf of the Secretary of State, considers that an exception to Schedule 2C Part 3 of the Animals (Scientific Procedures) Act 1986 is justified on this project, meaning specifically that protected animals taken from the wild, can be used.'
        }
      ]
    },
    feral: {
      include: project => project['feral-animals'],
      versions: [
        {
          title: 'Feral animals',
          content: 'ASRU, on behalf of the Secretary of State, considers that an exception to Schedule 2C Part 3 of the Animals (Scientific Procedures) Act 1986 is justified for this protocol, meaning specifically that feral animals of a domestic species, can be used.'
        }
      ]
    },
    poles: {
      include: project => project.poles && project.polesList && project.polesList.length,
      versions: [
        {
          title: 'POLEs',
          content: 'The assigned inspector must be notified before starting any procedures at a place other than a licensed establishment (POLE) authorised under this licence, in order that the inspector may be present if she or he wishes. The minimum period of notice to be given, the information to be provided and the means of notification must be agreed in writing with the Inspector at least 7 days before regulated procedures at a POLE are started.'
        }
      ]
    },
    rehoming: {
      include: project => (project['fate-of-animals'] || []).includes('rehomed'),
      versions: [
        {
          title: 'Rehoming',
          content: `Animals, as described in the rehoming section of this licence, may be rehomed at the end of a series of regulated procedures provided that the following actions have been taken:
    * The NVS has advised immediately prior to the animal being re-homed that in their opinion the animal's  state of health allows it  to be re-homed
    * The NVS has advised immediately prior to the animal being re-homed that to the best of their knowledge the potential re-homing poses no danger to public health, animal health or the environment
    * The NACWO, in consultation with the NVS, will only re-home animals where they are satisfied, after making suitable enquiries, that the animal is likely to successfully settle into the new environment and is confident that the new owner has both the knowledge and proper facilities to provide for the care and welfare of the animal
    * The prospective new owner has confirmed that they are aware that the animal has previously been held at an establishment licensed for scientific research, that  when relevant to the animal’s history) they are aware that the animal was previously subjected to regulated procedures but is no longer suffering or likely to suffer adverse effects as a result of those regulated procedures, that they have adequate knowledge to provide  for the ongoing care and welfare of the animal
    Genetically altered animals may not be re-homed.`
        }
      ]
    },
    reuse: {
      include: project => project['reusing-animals'],
      versions: [
        {
          title: 'Re-use',
          content: 'There is no authority to re-use animals in this project.'
        }
      ]
    },
    'setting-free': {
      include: project => (project['fate-of-animals'] || []).includes('set-free'),
      versions: [
        {
          title: 'Setting free',
          content: `Animals, as described in this project, may be set free at the end of the series of regulated procedures conducted provided that the following actions have been taken:
    * suitable actions to ensure the state of health allows the animal to be set free
    * suitable actions to ensure that the setting free of the animal poses no danger to public health, animal health or the environment
    * suitable actions to ensure socialisation of the animal on being set free
    * any other appropriate measures to safeguard the animal's welfare on being set free`
        }
      ]
    },
    'continued-use': {
      // TODO: confirm condition and content
      include: project => (project['fate-of-animals'] || []).includes('used-in-other-projects'),
      versions: [
        {
          title: 'Continued use',
          content: 'Lorem ipsum'
        }
      ]
    },
    transfer: {
      include: project => intersection([
        'mice',
        'rats',
        'guinea-pigs',
        'hamsters-syrian',
        'hamsters-chinese',
        'gerbils',
        'other-rodents',
        'xenopus',
        'zebra-fish'
      ], project.species).length && some(project.protocols, protocol => protocol.gaas),
      versions: [
        {
          title: 'Export of animals (transfer)',
          content: `Genetically altered rodents, genetically altered zebra fish and genetically altered Xenopus sp. bred and/or maintained under the authority of this project may be transferred to scientific establishments outside the United Kingdom only if:
    1. The transfer will be made to a recognised scientific research establishment with a scientific requirement for genetically altered animals (or their controls) of that type; and where appropriate veterinary care can be provided as necessary; and
    2. Sending tissue, gametes or embryos is not practicable or carries a higher potential welfare cost than moving live animals; and
    3. Animals will be transported in accordance with all relevant regulations regarding welfare of animals in transit or the import or export of animals; and
    4. Animals will be inspected by a competent person before transfer; and
    5. A veterinary surgeon will confirm that he/she is not aware of any reason why these animals might suffer by virtue of the fact of being moved to another recognised scientific establishment.
    6. Any transport related problems with the welfare of the animals will be notified to the Home Office promptly.`
        }
      ]
    },
    slaughter: {
      include: project => project['commercial-slaughter'],
      versions: [
        {
          title: 'Commercial slaughter',
          content: `Animals, as described in this licence, may be sent directly to slaughter at a registered slaughterhouse at the end of their use provided that:
    * The animal is healthy and meets the commercial requirements for meat hygiene to enable them to enter the food chain. They must not be infected with any notifiable disease and comply with the relevant substance withdrawal times
    * While kept alive at  pending transport to the slaughterhouse the animal is kept in an appropriate social group under the supervision of the NVS
    * The animal is appropriately identified and is transported in accordance with the relevant legalisation`
        }
      ]
    },
    'non-sched-1': {
      // TODO: confirm condition and content
      versions: [
        {
          title: 'Non schedule one killing',
          content: 'Lorem ipsum'
        }
      ]
    },
    continuation: {
      include: project => project['transfer-expiring'],
      versions: [
        {
          title: 'Continuation of work',
          content: 'Authority is hereby given to transfer animals undergoing regulated procedures under the licence(s) specified below to this project for continued use in the relevant protocols:'
        }
      ]
    },
    training: {
      // TODO: add logic regarding training
      versions: [
        {
          title: 'Training requirement',
          content: 'This licence authority will expire on [6 months from today\'s date] unless evidence that [PPL holder name] has successfully completed accredited the PPL training module, is sent to aspa.london@homeoffice.gov.uk'
        }
      ]
    },
    'non-purpose-bred-sched-2': {
      include: project => !project['purpose-bred-animals'],
      versions: [
        {
          title: 'Non purpose bred schedule 2 animals',
          content: 'Standard condition 13(d) of this licence shall not apply in cases when the relevant animals bred for use in procedures are not suitable for the purpose of the programme of work as justified in the licence. '
        }
      ]
    },
    'human-material': {
      include: project => project['animals-containing-human-material'],
      versions: [
        {
          title: 'Animals containing human material',
          content: 'A written report will be sent to aspa.london@homeoffice.gov.uk giving details of the human DNA content of manipulated embryos cultured in vitro before implantation of such embryos into a recipient is carried out under relevant authorised Procedures on this licence. Embryos with a proportion of DNA may not be implanted into animals and grown beyond 14 days of development without the express written permission of the Secretary of State.'
        }
      ]
    },
    'keeping-alive': {
      include: project => (project['fate-of-animals'] || []).includes('kept-alive'),
      versions: [
        {
          title: 'Keeping alive',
          content: 'Lorem ipsum'
        }
      ]
    }
  },
  inspector: {
    regtox: {
      versions: [
        {
          title: 'Reg Tox',
          content: `Where studies are requested in order to meet regulatory requirements, they will be performed in compliance with relevant UK & EU legislative bodies including the European Medicines Agency (EMA), European Chemicals Agency (ECHA), the Medicines and Healthcare Products Regulatory Agency (MHRA), Health and Safety Executive (HSE) and the Veterinary medicines Directorate (VMD) in the UK. The guidance given in the various guidelines of the International Conference of Harmonisation (ICH) and The Organisation for Economic Co-operation and Development (OECD) are followed in the design of safety evaluation programmes and in the design of studies.

    For studies requested for other worldwide authorities, for example the US Food and Drugs Administration (FDA), a scientific justification will be sought if the study requirements exceed the requirements of the UK or EU regulatory authorities for similar studies; for example by their requiring a greater number of animals or a more severe test. Permission to perform such tests will be obtained prospectively form the Secretary of State and any valid scientific justification will be included within the records of the Project Licence.`
        }
      ]
    },
    antibody: {
      versions: [
        {
          title: 'Antibody generation',
          content: 'Antibodies can only be generated using animals when a non-animal alternative has been tried (including taking expert advice) and has failed'
        }
      ]
    },
    reporting: {
      versions: [
        {
          title: 'Reporting requirement',
          content: 'A report (in writing to ASRU, 14th Floor, Lunar House, Croydon, CR9 2BY / oral to [name/ assigned inspector] / by email to aspa.london@homeoffice.gov.uk*) on the project shall be made by [DATE] or after [NUMBER] animals have been used, whichever is the sooner. The report shall contain [information].'
        }
      ]
    },
    inspection: {
      versions: [
        {
          title: 'Inspection requirement',
          content: 'The licence holder shall ensure that the Assigned Inspector is notified before regulated procedures are applied at any place specified in this licence to enable the Inspector to be present if he/she wishes. The minimum period(s) of notice to be given, the information to be provided and the means of notification shall be agreed in writing with the Inspector at least 7 days before commencement of regulated procedures in this project.'
        }
      ]
    },
    anaesthesia: {
      versions: [
        {
          title: 'Anaesthesia',
          content: `Induction and maintenance of general or local anaesthesia, sedation or analgesia to mitigate the pain, suffering or distress associated with the performance of other regulated procedures is indicated using the following codes in protocols:
    AA no anaesthesia
    AB general anaesthesia with recovery
    AB-L local anaesthesia
    AC non-recovery general anaesthesia
    AD under neuromuscular blockade`
        }
      ]
    },
    'general-anaesthesia': {
      versions: [
        {
          title: 'General anaesthesia',
          content: 'All animals are expected to make a rapid and unremarkable recovery from the anaesthetic within two hours. Uncommonly animals that fail to do so or exhibit signs of pain, distress or of significant ill health will be killed by a Schedule 1 method unless a programme of enhanced monitoring and care is instituted until the animal fully recovers.'
        }
      ]
    },
    surgery: {
      versions: [
        {
          title: 'Surgery',
          content: `* Surgical procedures should be carried out aseptically, to at least the published Home Office minimum
    * In the uncommon event of post-operative complications, animals will be killed unless, in the opinion of a veterinary surgeon, such complications can be remedied promptly and successfully using no more than minor interventions. Minimally inflamed wounds without obvious infection may be re-closed on one occasion within 48 hours of the initial surgery. In the event of recurrence NVS advice will be followed
    * Peri and post-operative analgesia will be provided; agents will be administered as agreed in advance with the NVS
    * All animals are expected to make a rapid and unremarkable recovery from the anaesthetic within two hours. Uncommonly animals that fail to do so or exhibit signs of pain, distress or of significant ill health will be killed by a Schedule 1 method unless a programme of enhanced monitoring and care is instituted until the animal fully recovers
    * Any animal not fully recovered from the surgical procedure within 24 hrs (eating, drinking and return to normal behaviour) will be humanely killed`
        }
      ]
    },
    'admin-of-substances': {
      versions: [
        {
          title: 'Admin of substances and withdrawal of fluids',
          content: 'Lorem ipsum'
        }
      ]
    },
    'retrospective-assessment': {
      versions: [
        {
          title: 'Retrospective assessment',
          content: 'The Secretary of State has determined that a retrospective review of this licence is required, and should be submitted within 6 months of the licences expiration or revocation date.'
        }
      ]
    },
    'work-providing-a-service': {
      versions: [
        {
          title: 'Work providing a service',
          content: 'Lorem ipsum'
        }
      ]
    },
    'regulatory-testing': {
      versions: [
        {
          title: 'Regulatory testing',
          content: 'Lorem ipsum'
        }
      ]
    },
    'manufacturing-work': {
      versions: [
        {
          title: 'Manufacturing work',
          content: 'Lorem ipsum'
        }
      ]
    },
    'production-work': {
      versions: [
        {
          title: 'Production work',
          content: 'Lorem ipsum'
        }
      ]
    },
    'batch-testing': {
      versions: [
        {
          title: 'Batch testing',
          content: 'Lorem ipsum'
        }
      ]
    },
    'testing-household-products': {
      versions: [
        {
          title: 'Testing household products',
          content: `The following conditions apply to the testing of finished Household Products or their ingredients:
    * The use of animals in testing finished Household Products under this licence is prohibited
    * The testing of substances under this licence is prohibited where more than fifty per cent of the substance is intended or expected, at the time of testing, to be used as an ingredient in a household product unless there is a regulatory requirement under national or international legislation for testing which is authorised by a project licence or a non-regulatory requirement which is specifically authorised by the Secretary of State
    * If testing is carried out for a regulatory purpose, the licence holder must notify the Home Office of all such testing within 30 days of the first animal test, using the form of notification required by the Secretary of State
    * If testing of a substance is proposed under this licence where more than fifty per cent of the substance is intended or expected, at the time of testing, to be used as an ingredient in a household product and the testing is not for a regulatory purpose, the licence holder must apply for prospective authorisation to carry out such testing which, if granted, will be specific to the substance and purpose for which the application is made`
        }
      ]
    }
  },
  all: {
    confirmation: {
      versions: [
        {
          title: 'Confirmation of granted licence',
          content: 'Lorem ipsum.'
        }
      ]
    },
    places: {
      versions: [
        {
          title: 'Places',
          content: 'You are authorised to undertake this programme of scientific procedures at the following place(s)'
        }
      ]
    }
  }
}
