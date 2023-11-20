### CNetLoginPacket
| 屬性 | 發送 |
| --- | --- |
| 事件名稱 | pkt-net |
| 敘述 | WebSocket連線(connect)後，向伺服器進行登入。 |

### 請求結構
| 封包Key | Type | Value | Description |
|	--- | --- | --- | --- |
| *pkt_name | String | cp-net-login | （固定） |
| *head | Object |
| *head.serial | Number | (目前隨意) | 封包序列號（暫定）|
| *payload | Object |
| *payload.account | String | 帳號 | (目前隨意)
| *payload.name | String | 聊天室名稱 |
*表示必要

### 回應結構
- 請參考 [SNetLoginPacket](./SNetLoginPacket.md)
