### SPlayerChatPacket
| 屬性 | 接收 |
| --- | --- |
| 事件名稱 | spkt |
| 敘述 | 伺服器發送玩家聊天內容。 |

### 回應結構
| 封包Key | Type | Value | Description |
|	--- | --- | --- | --- |
| pkt_name | String | sp-player-chat | （固定） |
| head | Object |
| head.serial | Number | (目前隨意) | 封包序列號（暫定）|
| payload | Object |
| payload.from | String | 發送聊天者UUID |
| payload.message | String | 聊天訊息 |

## 相關
- 請參考 [CPlayerChatPacket](./CPlayerChatPacket.md)
