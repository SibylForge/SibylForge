### SNetLoginPacket
| 屬性 | 接收 |
| --- | --- |
| 事件名稱 | spkt |
| 敘述 | 發送CNetLoginPacket後，伺服器回應相關credential資訊。 |

### 回應結構
| 封包Key | Type | Value | Description |
|	--- | --- | --- | --- |
| pkt_name | String | sp-net-login | （固定） |
| head | Object |
| head.serial | Number | (目前隨意) | 封包序列號（暫定）|
| payload | Object |
| payload.is_success | Boolean | 登入成功 |
| payload.uuid | String | 使用者UUID |
| payload.identity | String | Credential | 後續所有請求所需的Token |

## 相關
- 請參考 [CNetLoginPacket](./CNetLoginPacket.md)
