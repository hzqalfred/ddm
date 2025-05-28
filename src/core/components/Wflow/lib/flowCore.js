import { ref, nextTick, onActivated } from 'vue'

import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import dagre from 'dagre/dist/dagre.min.js'
import FlowNodeStart from '@/core/components/Wflow/node/FlowNodeStart.vue'
import FlowNodeEnd from '@/core/components/Wflow/node/FlowNodeEnd.vue'
import FlowNode from '@/core/components/Wflow/node/FlowNode.vue'
import FlowNodeConverge from '@/core/components/Wflow/node/FlowNodeConverge.vue'
import {updateFlowNodeData, addFlowNodeData,deleteFlowNodeData} from '@/api/workflow'

import { createMessageHandler } from "@/core/Message";
const $message = createMessageHandler();

export default (state, $NodeEdit, emit, chart, props, $FlowBox) => {
  let flowData = ref(null)
  let nodeRow = ref({})
  let nodeDialogType = ref('')
  let currentNode = ref({})
  let graph = null

  let defaultNodeData = {
    nodeCode: '',
    nodeName: '',
    nodeType: '0',
    userCode: '',
    userName: '',
    candidatePost: '',
    candidatePostName: '',
    actType:'0',
    maxActNum:'1',
    completeActRatio:'100',
    hasDelete: '1',
    hasSkip:'0',
    hasNotice: '0',
    branchValue: '',
    nodeValue: '',
    createEvents:'',
    preEvents:'',
    endEvents: '',
    rollbackEvents: '',
    rejectEvents:'',
    callApiEvents:'',
    hiddenProperty:'',
    editProperty: '',
    buttonProperty: '',
    resultProperty: '',
    funCode: '',
    tableName: '',
    keyColumn: '',
    keyColumnSql: '',
  }

  // 开始节点
  register({
    shape: 'start-node',
    width: 100,
    height: 100,
    component: FlowNodeStart
  })

  // 结束节点
  register({
    shape: 'end-node',
    width: 100,
    height: 100,
    component: FlowNodeEnd
  })

  // 聚合节点
  register({
    shape: 'converge-node',
    width: 100,
    height: 100,
    component: FlowNodeConverge
  })
  
  //普通节点
  register({
    shape: 'org-node',
    width: 100,
    height: 100,
    component: FlowNode
  })

  //线
  Graph.registerEdge(
    'org-edge',
    {
      zIndex: -1,
      inherit: 'edge',
      attrs: {
        line: {
          stroke: '#63a0e9',
          strokeWidth: 1,
          sourceMarker: null
        }
      }
    },
    true
  )

  const nodeDataMap = {
    'start-node': {
      view: 'html-view',
      shape: 'html',
      size: {
        width: 80,
        height: 80
      }
    },
    'end-node': {
      view: 'html-view',
      shape: 'html',
      size: {
        width: 80,
        height: 80
      }
    },
    'org-node': {
      view: 'html-view',
      shape: 'html',
      size: { width: 200, height: 80 }
    },
    'converge-node': {
      view: 'html-view',
      shape: 'html',
      size: { width: 50, height: 80 }
    }
  }

  function createEdge(s, t) {
    return graph.createEdge({
      shape: 'org-edge',
      source: { cell: s.id },
      target: { cell: t.id }
    })
  }

  function createNode(nodeName, data) {
    //创建节点

    if (nodeName == 'org-node') {
      //创建普通节点
      return graph.addNode({
        shape: 'org-node',
        width: 160,
        height: 80,
        html: 'org-node',
        data: data
      })
    } else if (nodeName == 'converge-node') {
      //聚合节点
      return graph.addNode({
        shape: 'converge-node',
        width: 160,
        height: 0,
        html: 'converge-node',

        data: data
      })
    } else if (nodeName == 'start-node') {
      return graph.addNode({
        shape: 'start-node',
        id: 'start',
        width: 160,
        height: 80,
        data: {
          nodeName: '开始节点'
        },
        html: 'start-node'
      })
    } else if (nodeName == 'end-node') {
      return graph.addNode({
        shape: 'end-node',
        id: 'end',
        width: 160,
        height: 80,
        data: {
          nodeName: '结束节点'
        },
        html: 'end-node'
      })
    }
  }

  function removeLine(startNode, type) {
    //移除线
    if (type == 'before') {
      graph
        .getNeighbors(startNode, {
          outgoing: true
        })
        .forEach(function(item) {
          graph.removeCells(graph.getIncomingEdges(item))
        })
    } else {
      graph.removeCells(graph.getOutgoingEdges(startNode))
    }
  }

  function addCell(nodes, oldStartNode, oldNextNode, options) {
    //添加节点
    options = options ? options : {}

    // 添加节点
    graph.addCell(nodes)

    if (options.type == '6') {
      nodes.forEach(function(item) {
        oldStartNode.forEach(function(v) {
          graph.addCell([createEdge(v, item)])
        })

        oldNextNode.forEach(function(v) {
          graph.addCell([createEdge(item, v)])
        })
      })
    } else if (options.type == '0') {
      //串签节点
      graph.addCell([createEdge(oldStartNode, nodes[0])])

      nodes.forEach(function(item, index) {
        if (nodes.length - 1 != index) {
          graph.addCell([createEdge(item, nodes[index + 1])])
        } else {
          //最后一个节点需要循环进行连接
          oldNextNode.forEach(function(v) {
            graph.addCell([createEdge(item, v)])
          })
        }
      })
    } else if (options.type == '1') {
      let convergeNode = createNode('converge-node')
      graph.addCell(convergeNode)
      //并签节点,需创建聚合节点
      nodes.forEach(function(item) {
        graph.addCell([createEdge(oldStartNode, item)])
        graph.addCell([createEdge(item, convergeNode)])
      })

      oldNextNode.forEach(function(item) {
        graph.addCell([createEdge(convergeNode, item)])
      })
    } else if (options.type == '2') {
      let spanNode = graph.getNeighbors(oldNextNode[0], {
        outgoing: true //只获取后面节点
      })

      nodes.forEach(function(item) {
        graph.addCell([createEdge(oldStartNode, item)])
      })

      //下一节点为单个,再次添加变成并签,添加聚合节点
      if (oldNextNode.length == 1) {
        let convergeNode = createNode('converge-node')
        graph.addCell(convergeNode)

        let newNextNodes = graph.getNeighbors(oldStartNode, {
          outgoing: true //只获取后面节点
        })

        graph.removeCells(graph.getOutgoingEdges(oldNextNode[0]))

        newNextNodes.forEach(function(item) {
          graph.addCell([createEdge(item, convergeNode)])
        })

        spanNode.forEach(function(item) {
          graph.addCell([createEdge(convergeNode, item)])
        })
      } else {
        nodes.forEach(function(item) {
          spanNode.forEach(function(v) {
            graph.addCell([createEdge(item, v)])
          })
        })
      }
    } else if (options.type == '3') {
      // 如果结束节点的前面一个节点为聚合节点,那么直接连接到聚合节点上面
      let endNode = graph.getCellById('end')
      let newEndNode = null
      let endIncoming = graph.getNeighbors(endNode, {
        incoming: true //只获取前面节点
      })
      let isAddNode = false
      if (endIncoming.length == 1 && endIncoming[0].shape == 'converge-node') {
        newEndNode = endIncoming[0]
      } else {
        let convergeNode = createNode('converge-node')

        // 断开前面结束节点与前面节点的连接

        graph.removeCells(graph.getIncomingEdges(endNode))
        newEndNode = convergeNode
        isAddNode = true
      }
      // 添加线
      graph.addCell([createEdge(oldStartNode, nodes[0])])

      nodes.forEach(function(item, index) {
        if (nodes.length - 1 != index) {
          graph.addCell([createEdge(item, nodes[index + 1])])
        } else {
          // 最后一个节点与结束节点连接
          graph.addCell([createEdge(item, newEndNode)])
        }
      })

      if (isAddNode) {
        endIncoming.forEach(function(item) {
          graph.addCell([createEdge(item, convergeNode)])
        })
        graph.addCell([createEdge(convergeNode, endNode)])
      }
    } else {
      // 添加线
      nodes.forEach(function(item) {
        graph.addCell([createEdge(oldStartNode, item)])
        oldNextNode.forEach(function(v) {
          graph.addCell([createEdge(item, v)])
        })
      })
    }

    layout()
  }

  function flowToJson() {
    return graph.toJSON()
  }
  function layout() {
    const nodes = graph.getNodes()
    const edges = graph.getEdges()
    const g = new dagre.graphlib.Graph()
    const dir = 'TB'
    g.setGraph({ rankdir: dir, nodesep: 16, ranksep: 16 })
    g.setDefaultEdgeLabel(() => ({}))

    const width = 200
    const height = 150
    nodes.forEach(node => {
      g.setNode(node.id, { width, height })
    })

    edges.forEach(edge => {
      const source = edge.getSource()
      const target = edge.getTarget()
      g.setEdge(source.cell, target.cell)
    })

    dagre.layout(g)

    let arr = [['start']]
    function getLevel(keys) {
      //获取节层级
      var nweArr = []
      edges.forEach(function(item) {
        if (keys.indexOf(item.source.cell) !== -1) {
          nweArr.push(item.target.cell)
        }
      })
      if (nweArr != 0) {
        arr.unshift(nweArr)

        getLevel(arr[0])
      }
    }

    getLevel(arr[0])

    function deWidghtDblArr(oldArr) {
      let newArr = []
      oldArr.forEach(function(item) {
        let newItem = []
        if (newArr.length == 0) {
          newArr.push(item)
        } else {
          item.forEach(function(v) {
            let isExistence = false

            newArr.forEach(function(e) {
              if (e.indexOf(v) !== -1) {
                isExistence = true
              }
            })

            if (!isExistence) {
              newItem.push(v)
            }
          })

          newArr.push(newItem)
        }
      })

      return newArr
    }

    // 去重后的数据
    var newArr = deWidghtDblArr(arr)
    g.nodes().forEach(id => {
      const node = graph.getCellById(id)
      if (node) {
        const pos = g.node(id)

        let x = pos.x
        let y = pos.y
        if (dir === 'TB') {
          var startY = g.node('start').y
          if (id !== 'start') {
            var level = null
            //获取层级关系

            arr.some(function(item, index) {
              if (item.indexOf(id) !== -1) {
                level = Math.abs(index - arr.length)
                return true
              }
            })

            y = startY * level * 2
          } else {
            y = y + 80
          }

          // 获取节点的前置节点
          var convergeNodeNum = 0
          graph.getPredecessors(node).forEach(function(item) {
            if (item.shape == 'converge-node') {
              var isLevel = false
              // 并且聚合节点层级关系不能与审批节点同级
              newArr.forEach(function(n) {
                if (n.indexOf(item.id) !== -1) {
                  n.some(function(v) {
                    if (v !== item.id && graph.getCellById(v) !== 'converge-node') {
                      isLevel = true
                      return true
                    }
                  })
                }
              })

              if (!isLevel) {
                // 前置节点存在聚合的个数
                convergeNodeNum++
              }
            }
          })

          if (convergeNodeNum) {
            y = y - convergeNodeNum * 80
          }
        }
        node.position(x, y)

      }
    })

    edges.forEach(edge => {
      const source = edge.getSourceNode()
      const target = edge.getTargetNode()
      const sourceBBox = source.getBBox()
      const targetBBox = target.getBBox()

      if ((dir === 'LR' || dir === 'RL') && sourceBBox.y !== targetBBox.y) {
        const gap = dir === 'LR' ? targetBBox.x - sourceBBox.x - sourceBBox.width : -sourceBBox.x + targetBBox.x + targetBBox.width
        const fix = dir === 'LR' ? sourceBBox.width : 0
        const x = sourceBBox.x + fix + gap / 2
        edge.setVertices([
          { x, y: sourceBBox.center.y },
          { x, y: targetBBox.center.y }
        ])
      } else if ((dir === 'TB' || dir === 'BT') && sourceBBox.x !== targetBBox.x) {
        const gap = dir === 'TB' ? targetBBox.y - sourceBBox.y - sourceBBox.height : -sourceBBox.y + targetBBox.y + targetBBox.height
        const fix = dir === 'TB' ? sourceBBox.height : 0
        const y = sourceBBox.y + fix + gap - 15
        edge.setVertices([
          {
            x: sourceBBox.center.x,
            y: y
          },
          {
            x: targetBBox.center.x,
            y: y
          }
        ])
      } else {
        edge.setVertices([])
      }
    })

    graph.resize(undefined, graph.getContentArea().height)
  }
  function resetGraph() {
    graph.resetCells([])
    let data = getVueGraphData(flowData.value)
    //console.log(data, flowData.value, 'flowData.value')
    graph.resetCells(data)
    layout()
  }

  function getVueGraphData(flowData) {
    let data = []

    flowData.cells.forEach(item => {
      if (item.shape !== 'org-edge') {
        let node = null

        if (item.id == 'start') {
          node = {
            shape: 'start-node',
            id: item.id,
            width: 160,
            height: 80,
            html: 'start-node',
            data: {
              nodeName: '开始节点'
            }
          }
        } else if (item.id == 'end') {
          node = {
            shape: 'end-node',

            id: item.id,
            width: 160,
            height: 80,
            html: 'end-node',
            data: {
              nodeName: '结束节点'
            }
          }
        } else if (item.html == 'org-node') {
          node = {
            shape: 'org-node',

            id: item.id,
            width: 160,
            height: 80,
            data: item.data,
            html: 'org-node'
          }
        } else if (item.html == 'converge-node') {
          node = {
            shape: 'converge-node',
            id: item.id,
            width: 160,
            height:1,
            html: 'converge-node'
          }
        }

        data.push(graph.createNode(node))
      } else {
        data.push(
          graph.createEdge({
            id: item.id,
            shape: 'org-edge',
            source: item.source.cell,
            target: item.target.cell
          })
        )
      }
    })

    return data
  }
  function initFlow() {

    if (!graph) {
      graph = new Graph({
        container: $FlowBox.value,
        grid: false,
        preventDefaultContextMenu: false, //不禁用右击
        interacting: false,
        scroller: true,
        resizing:true,
        autoResize: true
      })

    }

    graph.resetCells([])
    let data = []

    if (props.chart) {
      flowData.value = JSON.parse(props.chart)
      data = getVueGraphData(flowData.value)
    } else {
      let initNode = [createNode('start-node'), createNode('end-node')]
      flowData.value = [...initNode, createEdge(initNode[0], initNode[1])]
      data = flowData.value
    }

    graph.resetCells(data)
    layout(graph)
    graph.centerContent()
    graph.positionContent('top')
    graph.on('node:customevent', obj => {

      if (obj.name == 'edit') {
        nodeDialogType.value = 'edit'
        nodeRow.value = JSON.parse(JSON.stringify(obj.node.data))
        currentNode.value = obj.cell
        $NodeEdit.value.openNodeEditDialog()

      } else if (obj.name == 'add') {
        nodeDialogType.value = 'add'
        currentNode.value = obj.cell
        nodeRow.value = JSON.parse(JSON.stringify(defaultNodeData))
        $NodeEdit.value.openNodeEditDialog()
      } else if (obj.name == 'delete') {

        $message.confirmAction('确认删除该节点吗?', '提示',
          () => {
            removeNode(obj.cell)
            if (props.graphType == 'layout') {
    
              emit('getLayoutData', state => {
              let id = obj.cell.id
              let instId = state.value.flowData.instId
              let chart = getSaveGraphData()
              deleteFlowNodeData({
                  curNodeId: id,
                  instanceId: instId,
                  chart: JSON.stringify(chart)
                })
                .then(res => {
                  if (res.code == '200') {
                    flowData.value = JSON.parse(res.data)
                    //将主组件数据一并更改
                    state.value.flowData.procVos.some(item => {
                      if (item.procId == state.value.currentFlowId) {
                        item.chart = res.data
                        return true
                      }
                    })
                    resetGraph()
                  } else {
                    // 还原画布
                    resetGraph()
                  }
                })
                .catch(err => {
                  $message.notifyError('删除失败')
                  resetGraph()
                  })
                })
    
            }
          }
        )
      }
    })
  }

  nextTick(() => {
    initFlow()
  })

  function successNode(row) {
    if (nodeDialogType.value == 'edit') {
      //编辑
      currentNode.value.setData({
        ...row
      })
    } else if (nodeDialogType.value == 'add') {
      addNode(currentNode.value, row)
    }
    
    if (props.graphType == 'layout') {
      emit('getLayoutData', state => {
        let id = currentNode.value.id
        let instId = state.value.flowData.instId
        let chart = getSaveGraphData()

        if (nodeDialogType.value == 'edit') {
          //编辑
           updateFlowNodeData({
              curNodeId: id,
              instanceId: instId,
              chart: JSON.stringify(chart)
            }) 
            .then(res => {
              if (res.code == '200') {
                flowData.value = JSON.parse(res.data)
                //将主组件数据一并更改
                state.value.flowData.procVos.some(item => {
                  if (item.procId == state.value.currentFlowId) {
                    item.chart = res.data
                    return true
                  }
                })
                resetGraph()
              } else {
                // 还原画布
                resetGraph()
              }
            })
            .catch(err => {
               $message.notifyError('修改失败')
              resetGraph()
            })
     
        } else if (nodeDialogType.value == 'add') {
          addFlowNodeData({
              curNodeId: id,
              instanceId: instId,
              chart: JSON.stringify(chart),
              addNodeId: ''
            })
            .then(res => {
              if (res.code == '200') {
                $message.notifySuccess(res.msg || '新增成功')

                flowData.value = JSON.parse(res.data)
                //将主组件数据一并更改
                state.value.flowData.procVos.some(item => {
                  if (item.procId == state.value.currentFlowId) {
                    item.chart = res.data
                    return true
                  }
                })
                resetGraph()
              } else {
                // 还原画布
                resetGraph()
              }
            })
            .catch(err => {
              $message.notifyError('新增失败')
              resetGraph()
            })
        }
      })
    }
  }

  function addNode(node, row) {
    let type = row.nodeType

    let userNameArr = row.userName.split(';')
    let userCodeArr = row.userCode.split(';')
    let candidatePostNameArr = row.candidatePostName.split(';')

    let candidatePostIdArr = row.candidatePost.split(';')
    let nodeUserAudit = userCodeArr
    nodeUserAudit = nodeUserAudit.concat(candidatePostIdArr)

    let nodeList = []

    userCodeArr.forEach(function(item, index) {
      if (item) {
        let nodeItem = Object.assign(row, {
          userName: userNameArr[index],
          userCode: item,
          candidatePost: '',
          candidatePostName: ''
        })

        nodeList.push(JSON.parse(JSON.stringify(nodeItem)))
      }
    })

    candidatePostIdArr.forEach(function(item, index) {
      if (item) {
        let nodeItem = Object.assign(row, {
          userName: '',
          userCode: '',
          candidatePost: item,
          candidatePostName: candidatePostNameArr[index]
        })
        nodeList.push(JSON.parse(JSON.stringify(nodeItem)))
      }
    })

    // 如果未设置审批岗位或者审批人则创建一个空节点
    if (nodeList.length == 0 && (type == '0' || type == '2' || type == '3')) {
      nodeList.push(
        Object.assign(row, {
          userName: '',
          userCode: '',
          candidatePost: '',
          candidatePostName: ''
        })
      )
    } else if (type == '1') {
      if (nodeList.length == 1) {
        nodeList.push(
          Object.assign(row, {
            userName: '',
            userCode: '',
            candidatePost: '',
            candidatePostName: ''
          })
        )
      } else if (nodeList.length == 0) {
        for (let i = 0; i < 2; i++) {
          nodeList.push(
            Object.assign(row, {
              userName: '',
              userCode: '',
              candidatePost: '',
              candidatePostName: ''
            })
          )
        }
      }
    }

    let startNode = graph.getCellById(node.id)

    let nextNode = graph.getNeighbors(startNode, {
      outgoing: true //只获取后面节点
    })

    if (type == '0') {
      // 将节点合并为一个

      // 生成多个节点
      let member = []
      let userCodes = []
      let userNames = []
      let deptIds = []
      let deptNames = []

      nodeList.forEach(function(item) {
        // member.push(createNode('org-node', item))
        if (item.userCode) {
          userCodes.push(item.userCode)
          userNames.push(item.userName)
        }

        if (item.candidatePost) {
          deptIds.push(item.candidatePost)
          deptNames.push(item.candidatePostName)
        }
      })

      member.push(
        createNode('org-node', {
          ...nodeList[0],
          userCode: userCodes.join(';'),
          userName: userNames.join(';'),
          candidatePost: deptIds.join(';'),
          candidatePostName: deptNames.join(';')
      })
      )

      //console.log(member, 'member')
      removeLine(startNode)
      addCell(member, startNode, nextNode, {
        type: '0' //串联
      })
    } else if (type == '1') {
      // 生成多个节点
      let member = []
      let inodeName = ''
      nodeList.forEach(function(item,index) {
        if(!inodeName){
          inodeName = item.nodeName
        }
        item.nodeName = inodeName + '_'+(index+1);
        member.push(createNode('org-node', item))
      })

      removeLine(startNode)
      addCell(member, startNode, nextNode, {
        type: '1'
      })
    } else if (type == '2') {
      //与下一节点并签

      // 判断下一节点是否为结束节点
      if (nextNode[0].id == 'end') {
        $message.notifyWarning('下一节点为结束节点,不可添加')

        return
      }

      if (nextNode[0].html == 'converge-node') {
        $message.notifyWarning('下一节点为聚合节点,不可添加')

        return
      }

      // 生成多个节点
      let member = []
      nodeList.forEach(function(item) {
        member.push(createNode('org-node', item))
      })

      addCell(member, startNode, nextNode, {
        type: '2'
      })
    } else if (type == '3') {
      if (nextNode.length == 1 && nextNode[0].id == 'end') {
        $message.notifyWarning('下一节点为结束节点,不可添加')
      }
      // 生成多个节点
      let member = []
      nodeList.forEach(function(item) {
        member.push(createNode('org-node', item))
      })

      addCell(member, startNode, nextNode, {
        type: '3'
      })
    }
  }
  function removeNode(node) {
    let outgoing = graph.getNeighbors(node, {
      outgoing: true //只获取后面节点
    })

    let incoming = graph.getNeighbors(node, {
      incoming: true //只获取前面节点
    })

    //可能为聚合节点后面的节点
    let canOutgoing = graph.getNeighbors(outgoing[0], {
      outgoing: true //只获取后面节点
    })

    graph.removeNode(node)

    let getOutgoingEdges = graph.getOutgoingEdges(incoming[0])
    let getIncomingEdges = graph.getIncomingEdges(outgoing[0])

    // 将节点重新连接
    if (!getOutgoingEdges || !getIncomingEdges) {
      incoming.forEach(function(item) {
        outgoing.forEach(function(v) {
          graph.addCell([createEdge(item, v)])
        })
      })
    }

    // 获取删除后的节点
    let currentLevelNodes = graph.getNeighbors(outgoing[0], {
      incoming: true
    })

    // 判断是否需要删除聚合节点
    if (currentLevelNodes.length == 1 && outgoing[0].shape == 'converge-node') {
      graph.removeCells(outgoing)

      currentLevelNodes.forEach(function(item) {
        canOutgoing.forEach(function(v) {
          graph.addCell([createEdge(item, v)])
        })
      })
    }

    layout()
  }

  function getSaveGraphData() {
    let data = flowToJson()

    // 将数据转换为不分离版本适用数据
    data.cells.map((item, index) => {
      if (nodeDataMap[item.shape]) {
        data.cells[index] = {
          ...item,
          ...nodeDataMap[item.shape]
        }
      }
    })

    return data
  }

  onActivated(() => {
    try {
      if(graph){
        layout()

      }
    } catch (err) {
        //路由激活重新计算
    }
  })
  return {
    flowData,
    nodeRow,
    nodeDialogType,
    currentNode,
    graph,
    defaultNodeData,
    createEdge,
    createNode,
    removeLine,
    addCell,
    flowToJson,
    layout,
    initFlow,
    successNode,
    getSaveGraphData
  }
}
