// prints numbers of protocols in the following formats:
// 1 and 2
// 1, 2 and 3
function getProtocolParts(protocols) {
  return protocols.map((p, i) => {
    const str = `${p.index + 1}`;
    if (i === protocols.length - 1) {
      return ` and ${str}`;
    }
    if (i > 0) {
      return `, ${str}`;
    }
    return str;
  }).join('');
}

const confirmProtocolsAffected = (changeType, protocolRef, singularName, key, label) => (project, item) => {
  const protocols = (project.protocols || [])
    .filter(p => !p.deleted)
    .map((protocol, index) => ({ ...protocol, index }));

  const affectedProtocols = protocols.filter(protocol => (protocol[protocolRef] || []).includes(key ? item[key] : item));

  // item doesn't appear in any protocols
  if (!affectedProtocols.length) {
    return true;
  }

  let message = `Protocols will be affected\n\n`;

  if (changeType === 'remove') {
    message = `${message}Removing this ${singularName} will also remove it from`;
  } else {
    message = `${message}Changing the ${label || key} of this ${singularName} will remove it from`;
  }

  // item appears in all protocols
  if (affectedProtocols.length === protocols.length) {
    return window.confirm(`${message} all protocols.`);
  }

  const protocolText = affectedProtocols.length === 1
    // item appears in a single protocol
    ? `protocol ${affectedProtocols[0].index + 1}`
    // item appears in many protocols, list them
    : `protocols ${getProtocolParts(affectedProtocols)}`;

  return window.confirm(`${message} ${protocolText}.`);
};

export default confirmProtocolsAffected;
