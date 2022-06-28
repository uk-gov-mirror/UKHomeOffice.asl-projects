import React, { useState } from 'react';
import Fieldset from './fieldset';

const getFields = conditionKey => {
  return [
    {
      name: `active`,
      label: '',
      type: 'checkbox',
      className: 'smaller',
      preserveHierarchy: true,
      options: [
        {
          label: 'Set a reminder for deadlines associated with this condition',
          value: conditionKey,
          reveal: [
            {
              name: conditionKey,
              type: 'repeater',
              singular: 'Condition deadline',
              hint: 'Licence holders will receive reminders a month before, a week before and on the day the condition is due to be met. ASRU will receive a reminder when the deadline has passed.',
              addAnotherLabel: 'Add another deadline',
              addAnotherClassName: 'link',
              showPanel: false,
              fields: [
                {
                  name: 'deadline',
                  type: 'date',
                  label: ''
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};

function Reminders({ conditionKey, onChange, values = {} }) {
  const [reminders, setReminders] = useState(values);
  const fields = getFields(conditionKey);

  const onFieldChange = (key, value) => {
    const updated = { ...reminders, [key]: value };

    setReminders(updated);
    onChange(updated);
  };

  return (
    <div className="reminders">
      <Fieldset
        fields={fields}
        values={reminders}
        onFieldChange={onFieldChange}
        noComments={true}
      />
    </div>
  );
}

export default Reminders;
