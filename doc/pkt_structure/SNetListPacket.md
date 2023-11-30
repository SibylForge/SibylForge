### SNetListPacket
| 屬性 | 接收 |
| --- | --- |
| 事件名稱 | spkt |
| 敘述 | 伺服器發送目前所有在線玩家資訊。 |

## 回應結構
| 封包Key | Type | Value | Description |
|	--- | --- | --- | --- |
| pkt_name | String | cp-net-list | （固定） |
| head | Object |
| head.serial | Number | (目前隨意) | 封包序列號（暫定）|
| payload | Object |
| payload.list | Map<String, String> | 以ULID String為Key, Player name為value |
