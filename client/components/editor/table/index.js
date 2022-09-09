import EditTable from '@joefitter/slate-edit-table';
import renderBlock from './renderers';

export default function Table() {
  const core = EditTable({
    typeTable: 'table',
    typeRow: 'table-row',
    typeCell: 'table-cell',
    typeContent: 'paragraph'
  });
  return {
    ...core,
    renderBlock
  };
}
