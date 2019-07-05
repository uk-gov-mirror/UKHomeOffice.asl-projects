import some from 'lodash/some';
import intersection from 'lodash/intersection';

export default {
  protocol: {
    nmbas: {
      include: protocol => some(protocol.steps, step => step.nmbas),
      type: 'condition',
      versions: [
        {
          title: 'NMBAs',
          content: 'All work under authority of this protocol involving the use of neuromuscular blocking agents must be carried out in accordance with the Home Office guidelines'
        }
      ]
    },
    poles: {
      include: (protocol, project) => intersection(protocol.locations, (project.polesList || []).map(pole => pole.title)).length,
      type: 'condition',
      versions: [
        {
          title: 'POLEs',
          content: 'The assigned inspector must be notified before starting any procedures at a place other than a licensed establishment (POLE) authorised under this licence, in order that the inspector may be present if she or he wishes. The minimum period of notice to be given, the information to be provided and the means of notification must be agreed in writing with the Inspector at least 7 days before regulated procedures at a POLE are started.'
        }
      ]
    },
    reuse: {
      include: protocol => some(protocol.speciesDetails, species => species.reuse),
      type: 'authorisation',
      versions: [
        {
          title: 'Re-use',
          content: '{Type of animal} may be re-used in this protocol provided that all criteria in section 14 of the Animals (Scientific Procedures) Act and in this project licence are fulfilled.'
        }
      ]
    },
    'continued-use': {
      include: protocol => some(protocol.speciesDetails, species => species['continued-use']),
      type: 'authorisation',
      versions: [
        {
          title: 'Continued use on to protocol',
          content: '{Type of animals} coming onto this protocol from {PPL number or protocols 1,2 or 3 of this project} are authorised for continued use'
        }
      ]
    },
    'continued-use-off-protocol': {
      include: protocol => (protocol.fate || []).includes('continued-use'),
      type: 'authorisation',
      versions: [
        {
          title: 'Continued use off protocol',
          content: '{Type of animals} may continue to be used on {protocols 1, 2 or 3 of this project}'
        }
      ]
    },
  },
  project: {
    nmbas: {
      include: project => some(project.protocols, protocol => some(protocol.steps, step => (step.code || []).includes('ad'))),
      type: 'condition',
      versions: [
        {
          title: 'NMBAs',
          content: 'All work under authority of this licence involving the use of neuromuscular blocking agents must be carried out in accordance with the Home Office guidelines'
        }
      ]
    },
    marmosets: {
      include: project => (project.species || []).includes('marmosets') && !project['marmoset-colony'],
      type: 'condition',
      versions: [
        {
          title: 'Marmosets',
          content: 'ASRU, on behalf of the Secretary of State, considers that an exception to Schedule 2C Part 3 of the Animals (Scientific Procedures) Act 1986 is justified for this protocol, meaning specifically that marmosets that are not offspring of animals bred in captivity, or have been obtained from a self-sustaining colony, can be used.'
        }
      ]
    },
    wild: {
      include: project => project['wild-animals'],
      type: 'condition',
      versions: [
        {
          title: 'Animals taken from the wild',
          content: 'Standard condition 13(b) of this licence shall not apply in cases when {animals} bred for use in procedures are not suitable for the purpose of the programme of work specified in the licence as justified in the project licence application.'
        }
      ]
    },
    feral: {
      include: project => project['feral-animals'],
      type: 'condition',
      versions: [
        {
          title: 'Feral animals',
          content: 'Standard condition 13(a) of this licence shall not apply in cases when {animals} bred for use in procedures are not suitable for the purpose of the programme of work specified in the licence as justified in the project licence application.'
        }
      ]
    },
    poles: {
      include: project => project.poles && project.polesList && project.polesList.length,
      type: 'condition',
      versions: [
        {
          title: 'POLEs',
          content: 'The assigned inspector must be notified before starting any procedures at a place other than a licensed establishment (POLE) authorised under this licence, in order that the inspector may be present if she or he wishes. The minimum period of notice to be given, the information to be provided and the means of notification must be agreed in writing with the Inspector at least 7 days before regulated procedures at a POLE are started.'
        }
      ]
    },
    rehoming: {
      include: project => (project['fate-of-animals'] || []).includes('rehomed'),
      type: 'authorisation',
      versions: [
        {
          title: 'Rehoming',
          content: `{Type of animal} may be rehomed at the end of a series of regulated procedures provided that the following actions have been taken:
* {actions to ensure the state of health allows the animal to be re-homed};
* {actions to ensure that the rehoming of the animal poses no danger to public health, animal health or the environment};
* {actions to ensure socialisation of the animal on being re-homed}; and
* {any other measures to safeguard the animal's welfare on being re-homed. Genetically altered animals may not be re-homed.}`
        }
      ]
    },
    'setting-free': {
      include: project => (project['fate-of-animals'] || []).includes('set-free'),
      type: 'authorisation',
      versions: [
        {
          title: 'Setting free',
          content: `{Type of animal} may be set free during the course of procedures specified in protocol {number} / at the end of the series of regulated procedures conducted under the authority of protocol {number}* provided that the following actions have been taken:
* {actions to ensure the state of health allows the animal to be set free};
* {actions to ensure that the setting free of the animal poses no danger to public health, animal health or the environment};
* {actions to ensure socialisation of the animal on being set free}; and
* {any other measures to safeguard the animal's welfare on being set free}`
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
      type: 'authorisation',
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
      type: 'authorisation',
      versions: [
        {
          title: 'Commercial slaughter',
          content: `{Type of animal} may be sent directly to slaughter at a registered slaughterhouse at the end of their use provided that:
* The animal is healthy and meets the commercial requirements for meat hygiene to enable them to enter the food chain. They must not be infected with any notifiable disease and comply with the relevant substance withdrawal times
* While kept alive at pending transport to the slaughterhouse the animal is kept in an appropriate social group under the supervision of the NVS
* The animal is appropriately identified and is transported in accordance with the relevant legalisation`
        }
      ]
    },
    continuation: {
      include: project => project['transfer-expiring'],
      type: 'authorisation',
      playback: 'expiring-yes',
      versions: [
        {
          title: 'Continuation of work',
          content: 'Authority is hereby given to transfer animals undergoing regulated procedures under the licence(s) specified below to this project for continued use in the relevant protocols:'
        }
      ]
    },
    training: {
      // TODO: add logic regarding training
      include: () => false,
      type: 'condition',
      versions: [
        {
          title: 'Training requirement',
          content: 'This licence authority will expire on {6 months from today\'s date} unless evidence that {PPL holder name} has successfully completed accredited the PPL training module, is sent to [aspa.london@homeoffice.gov.uk](aspa.london@homeoffice.gov.uk)'
        }
      ]
    },
    'non-purpose-bred-sched-2': {
      include: project => !project['purpose-bred-animals'],
      type: 'condition',
      versions: [
        {
          title: 'Non purpose bred schedule 2 animals',
          content: 'Standard condition 13(d) of this licence shall not apply in cases when the relevant animals bred for use in procedures are not suitable for the purpose of the programme of work as justified in the project licence application.'
        }
      ]
    },
    'code-of-practice': {
      include: project => !project['establishments-care-conditions'],
      type: 'authorisation',
      versions: [
        {
          title: 'Establishment licences not meeting Code of Practice',
          content: '{Please add your specific conditions here}'
        }
      ]
    }
  },
  inspector: {
    regtox: {
      type: 'authorisation',
      versions: [
        {
          title: 'Regulatory Toxicology',
          content: `Where studies are requested in order to meet regulatory requirements, they will be performed in compliance with relevant UK & EU legislative bodies including the European Medicines Agency (EMA), European Chemicals Agency (ECHA), the Medicines and Healthcare Products Regulatory Agency (MHRA), Health and Safety Executive (HSE) and the Veterinary medicines Directorate (VMD) in the UK. The guidance given in the various guidelines of the International Conference of Harmonisation (ICH) and The Organisation for Economic Co-operation and Development (OECD) are followed in the design of safety evaluation programmes and in the design of studies.

For studies requested for other worldwide authorities, for example the US Food and Drugs Administration (FDA), a scientific justification will be sought if the study requirements exceed the requirements of the UK or EU regulatory authorities for similar studies; for example by their requiring a greater number of animals or a more severe test. Permission to perform such tests will be obtained prospectively form the Secretary of State and any valid scientific justification will be included within the records of the Project Licence.`
        }
      ]
    },
    antibody: {
      type: 'condition',
      versions: [
        {
          title: 'Antibody generation',
          content: 'Antibodies can only be generated using animals when a non-animal alternative has been tried (including taking expert advice) and has failed'
        }
      ]
    },
    reporting: {
      type: 'condition',
      versions: [
        {
          title: 'Reporting requirement',
          content: 'A report in writing to [aspa.london@homeoffice.gov.uk](aspa.london@homeoffice.gov.uk) or oral to {name/assigned inspector} on the project shall be made by {DATE} or after {NUMBER} animals have been used, whichever is the sooner. The report shall contain {information}.'
        }
      ]
    },
    inspection: {
      type: 'condition',
      versions: [
        {
          title: 'Inspection requirement',
          content: 'The licence holder shall ensure that the assigned inspector is notified before regulated procedures are applied at any place specified in this licence to enable the inspector to be present if he/she wishes. The minimum periods of notice to be given, the information to be provided and the means of notification shall be agreed in writing with the Inspector at least 7 days before commencement of regulated procedures in this project.'
        }
      ]
    },
    anaesthesia: {
      checked: true,
      type: 'condition',
      versions: [
        {
          title: 'Anaesthesia',
          content: `Induction and maintenance of general or local anaesthesia, sedation or analgesia to mitigate the pain, suffering or distress associated with the performance of other regulated procedures is indicated using the following codes in protocols:
* AA no anaesthesia
* AB general anaesthesia with recovery
* AB-L local anaesthesia
* AC non-recovery general anaesthesia
* AD under neuromuscular blockade`
        }
      ]
    },
    'general-anaesthesia': {
      type: 'condition',
      versions: [
        {
          title: 'General anaesthesia',
          content: 'All animals are expected to make a rapid and unremarkable recovery from the anaesthetic within two hours. Uncommonly animals that fail to do so or exhibit signs of pain, distress or of significant ill health will be killed by a Schedule 1 method unless a programme of enhanced monitoring and care is instituted until the animal fully recovers.'
        }
      ]
    },
    surgery: {
      type: 'condition',
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
      type: 'condition',
      versions: [
        {
          title: 'Admin of substances and withdrawal of fluids',
          content: 'Unless otherwise specified, administration of substances and withdrawal of body fluids will be undertaken using a combination of volumes, routes and frequencies that of themselves will result in no more than transient discomfort and no lasting harm using published guidelines on minimal severity.'
        }
      ]
    },
    'retrospective-assessment-negative': {
      type: 'condition',
      versions: [
        {
          title: 'Retrospective assessment (negative)',
          content: 'The Secretary of State has determined that a retrospective assessment of this licence is not required.'
        }
      ]
    },
    'retrospective-assessment': {
      type: 'condition',
      versions: [
        {
          title: 'Retrospective assessment (positive)',
          content: 'The Secretary of State has determined that a retrospective review of this licence is required, and should be submitted within 6 months of the licences expiration or revocation date.'
        }
      ]
    },
    places: {
      checked: true,
      type: 'authorisation',
      versions: [
        {
          title: 'Places',
          content: 'You are authorised to undertake this programme of scientific procedures at the following place(s)'
        }
      ]
    },
    'batch-testing': {
      type: 'condition',
      versions: [
        {
          title: 'Batch testing',
          content: 'For all batch quality control testing using live animals, the substance or product to be tested must be named in the licence providing scientific justification for such a test. You must notify the Home Office when an alternative non-animal test for a substance or product becomes validated and accepted in order that the authorisation for the ongoing use of the live animal test can be withdrawn for the particular substance or product.'
        }
      ]
    },
    'testing-household-products': {
      type: 'condition',
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
    },
    'minimise-suffering-wild-feral': {
      type: 'condition',
      versions: [
        {
          title: 'Minimising suffering for wild/feral animals',
          content: 'In accordance with paragraph 25(5) of Schedule 2C to the Act, the words “...and , unless the Secretary of State has agreed otherwise, action has been taken to minimise the suffering of the animal” in part (b) of Standard Condition 14 (b) of this licence shall not apply to wild {SPECIES} {or feral {SPECIES}} undergoing procedures under protocol {1, 2, 3} of the licence for the purpose of the programme of work specified and justified in the licence.'
        }
      ]
    }
  }
}
