import React, { Component } from 'react';
import styled from 'styled-components';
import Tree, {
  mutateTree,
  moveItemOnTree,
  RenderItemParams,
  TreeItem,
  TreeData,
  ItemId,
  TreeSourcePosition,
  TreeDestinationPosition,
} from '@atlaskit/tree';
import { complexTree } from './mockdata/complexTree';
import { iRawNode } from './types';
import { convertTree } from './utils';
console.log('complexTree: ', complexTree);

const PADDING_PER_LEVEL = 16;

const PreTextIcon = styled.span`
  display: inline-block;
  width: 16px;
  justify-content: center;
  cursor: pointer;
`;

type State = {
  tree: TreeData;
};

const getIcon = (
  item: TreeItem,
  onExpand: (itemId: ItemId) => void,
  onCollapse: (itemId: ItemId) => void,
) => {
  if (item.children && item.children.length > 0) {
    return item.isExpanded ? (
      <PreTextIcon onClick={() => onCollapse(item.id)}>-</PreTextIcon>
    ) : (
      <PreTextIcon onClick={() => onExpand(item.id)}>+</PreTextIcon>
    );
  }
  return <PreTextIcon>&bull;</PreTextIcon>;
};

const data: iRawNode[] = [
  {
    id: 1,
    order: 1,
    level: 1
  },
  {
    id: 2,
    order: 2,
    level: 1
  },
  {
    id: 3,
    order: 3,
    level: 1
  },
  {
    id: 4,
    parentId: 3,
    order: 1,
    level: 2
  },
  {
    id: 5,
    parentId: 1,
    order: 1,
    level: 2
  },
  {
    id: 6,
    parentId: 1,
    order: 1,
    level: 2
  },
  {
    id: 7,
    parentId: 2,
    order: 1,
    level: 2
  },
  {
    id: 8,
    parentId: 2,
    order: 2,
    level: 2
  },
  {
    id: 9,
    parentId: 3,
    order: 2,
    level: 2
  },
  {
    id: 10,
    parentId: 4,
    order: 1,
    level: 3
  }
];

export default class PureTree extends Component<{}, State> {
  state = {
    tree: convertTree(data),
  };

  renderItem = (params: RenderItemParams) => {
    const { item, onExpand, onCollapse, provided } = params
    console.log('provided: ', provided);
    console.log('data: ', item.data);
    const style = provided.draggableProps.style
    console.log('style: ', style);
    return (
      // <div>
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{...style}}
        >
          <div style={{ padding: '10px'}}>
            <span>{item.data ? item.data.title : ''}</span>
            <span>{getIcon(item, onExpand, onCollapse)}</span>
          </div>
        </div>
      // </div>
    );
  };

  onExpand = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: true }),
    });
  };

  onCollapse = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: false }),
    });
  };

  onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    const { tree } = this.state;

    if (!destination) {
      return;
    }
    const newTree = moveItemOnTree(tree, source, destination);
    console.log('destination: ', destination);
    console.log('source: ', source);
    this.setState({
      tree: newTree,
    });
  };

  render() {
    const { tree } = this.state;

    return (
      <Tree
        tree={tree}
        renderItem={this.renderItem}
        onExpand={this.onExpand}
        onCollapse={this.onCollapse}
        onDragEnd={this.onDragEnd}
        offsetPerLevel={PADDING_PER_LEVEL}
        isDragEnabled
      />
    );
  }
}