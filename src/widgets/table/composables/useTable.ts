import { type Ref } from "vue";

import { UseTableProps } from "@/widgets/table/types/props";

export function useTable(props: Ref<UseTableProps>) {
  const testProps = props.value;
  const handleRowClick = (row: Record<string, unknown>) => {
    return row;
  };

  return {
    testProps,
    handleRowClick,
  };
}
