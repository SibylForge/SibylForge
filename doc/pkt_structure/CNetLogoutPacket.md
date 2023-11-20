### CNetLogoutPacket
| 屬性 | 發送 |
| --- | --- |
| 事件名稱 | pkt-net |
| 敘述 | 玩家登出，發送至伺服器。 |

### 請求結構
| 封包Key | Type | Value | Description |
|	--- | --- | --- | --- |
| *pkt_name | String | cp-net-logout | （固定） |
| *identity | String | Credential |
| *head | Object |
| *head.serial | Number | (目前隨意) | 封包序列號（暫定）|
| *payload | Object |
*表示必要

### 回應結構
- 暫無
