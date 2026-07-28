---
name: task-router
description: Định tuyến task v1.0 theo mô hình Direct, Tracked và High-risk planned trên Node.js 20+.
license: MIT
---

# task-router v1.0

Đây là **decision router**, không phải quy trình quản lý dự án bắt buộc cho mọi
task. Mục tiêu là chọn mức ghi nhận và kiểm chứng vừa đủ, làm rõ việc cần làm,
rồi dừng khi đã đạt điều kiện hoàn tất.

## Triage ban đầu

Trước khi chọn mode, làm rõ ngắn gọn:

- outcome người dùng muốn đạt;
- điểm mơ hồ, giả định và phạm vi không làm;
- tác động lên behavior, contract, security/privacy và side effect;
- điều kiện observable để coi là xong và verification dự kiến.

Instruction cục bộ đã được caller nạp thì coi như đã đọc. Nếu chưa có, đọc
`AGENTS.md` gần nhất và chỉ đọc các file chính xác liên quan đến task. Không mặc
định đọc rộng docs, git history, architecture hoặc trạng thái harness.

Nếu chưa thể xác định outcome, phạm vi hoặc verification, hỏi lại trước khi
chọn mode. Không biến suy đoán thành acceptance.

## Ba mode

| Mode | Chọn khi | Cách thực hiện |
| --- | --- | --- |
| **Direct** | Mặc định cho việc rõ ràng, bounded, reversible và hoàn tất trong một session. | Không tạo artifact tracking của harness và không lập formal plan. Nêu scope nhỏ, done condition và verification inline khi hữu ích. |
| **Tracked** | Cần nhiều session hoặc handoff; acceptance đáng kể; có nhiều owner/milestone; cần blocker/next action bền vững; hoặc user yêu cầu ghi nhận. | Chỉ dùng/cập nhật artifact liên quan trực tiếp trong manifest/spec/work. Không ép cập nhật tiến độ hay plan toàn cục. |
| **High-risk planned** | Migration; auth/security/privacy; breaking API hoặc schema; data/external side effect không đảo ngược; rollout/rollback; chuỗi nguy hiểm qua nhiều hệ thống; hoặc còn material uncertainty chưa giải quyết. | Lập plan compact gồm context/outcome, approach/milestones, verification, risk/rollback và decisions/handoff. Không áp lifecycle plan riêng hoặc nghi thức heading cố định. |

Direct là mặc định, không phải cam kết giữ mode bằng mọi giá. Khi scope mở
rộng, acceptance tăng, xuất hiện owner khác hoặc rủi ro mới, reclassify sang
Tracked hoặc High-risk planned. Có thể quay về mode nhẹ hơn khi uncertainty và
rủi ro đã được giải quyết bằng evidence.

## Nguồn chuẩn trong mode Tracked

Chỉ áp dụng các quy tắc dưới đây khi task thực sự dùng artifact tracking:

- `harness/manifest.json` là registry feature và nơi duy nhất chứa feature
  status.
- `docs/specs/<id>.md` là nguồn chuẩn cho scope, behavior và acceptance
  observable.
- `harness/work/<id>.json` là execution record dẫn xuất. Work giữ
  `acceptanceResults`, `nextAction`, `completion` và `schemaVersion: 1`; không
  chép status, title hoặc blocker vào work.
- `harness/checks.json` là registry check; validator và runner là các script
  được registry/skill chỉ định.

Không tạo bản sao canonical, không đổi acceptance để làm verification xanh,
không coi log hoặc việc file tồn tại là evidence. Completion chỉ được báo khi
acceptance và verification có bằng chứng kiểm tra được. Blocker phải nói rõ
impact, phần chưa xác minh và next action; không giả vờ pass.

## Lệnh và checks

Chỉ chạy command khi kết quả của nó có thể thay đổi quyết định, scope hoặc
completion. Không lặp lại validation/check không đổi nếu không có lý do mới.

- Không chạy root initializer như một nghi thức orientation thường lệ.
- Chỉ chạy `node harness/scripts/validate.mjs` khi đang dùng hoặc thay đổi
  artifact tracked. Chạy một lần cho mỗi meaningful state; chạy lại sau thay
  đổi có thể ảnh hưởng kết luận.
- Chỉ chạy `node harness/scripts/run-checks.mjs` khi có configured check liên
  quan hoặc acceptance yêu cầu. Đọc usage của runner một lần trong session,
  sau đó chọn đúng profile/check cần thiết; không chạy toàn bộ registry theo
  thói quen.
- Chỉ yêu cầu effect approval cho effect của check đã chọn. Các key
  `network`, `writes`, `services`, `installs`, `secrets` và flag tương ứng phải
  khớp registry. Effect declaration là metadata để approval/audit, **không phải
  sandbox**.
- Check không có trong registry không được bịa ra. Nếu check cần thiết nhưng
  không thể chạy, báo phần chưa xác minh và blocker thật.

`harness-init` chỉ được chọn khi đã quan sát một missing canonical scaffold
artifact cụ thể, hoặc khi user đã explicit approve layout migration cụ thể.
Không gọi nó để sửa chung vấn đề access, dependency, documentation hay
capability. Khi được gọi, giữ các guarantee của harness-init: missing-only,
no-overwrite và migration chỉ khi có explicit consent.

## Verification theo tỷ lệ

| Loại việc | Verification tối thiểu phù hợp |
| --- | --- |
| Documentation/config | Review diff, heading/path/link và code sample liên quan. Chạy syntax check chỉ khi thay đổi đó có thể làm command hoặc parser hỏng. |
| Narrow code | Chạy test, syntax, lint hoặc typecheck gần nhất với change; thêm boundary case nếu behavior có nhánh mới. |
| Public/API behavior | Kiểm tra contract thành công và lỗi, input boundary, backward compatibility và observable output. |
| Cross-system | Chạy integration/fixture liên quan, kiểm tra timeout/retry/cleanup và chỉ cấp approvals cho effect đã chọn. |
| High-risk | Xác nhận precondition và owner approval; ưu tiên dry-run/staging nếu có; kiểm chứng rollback/recovery, failure mode và outcome sau side effect. |

Verification phải ghi command, exit/result và path/evidence khi có thể. Không
gọi một check “pass” nếu baseline đã fail mà chưa xác định attribution. Nếu
verification bắt buộc không có hoặc không truy cập được, dừng và báo blocker.

## Khi phải dừng, hỏi hoặc block

Dừng ngay khi acceptance và verification đã đạt; không thêm speculative cleanup.
Hỏi user, block hoặc replan khi gặp một trong các điều kiện sau:

- material ambiguity về outcome, scope, authority hoặc acceptance;
- side effect hoặc hành động irreversible chưa được approve;
- local changes chồng lấn và không thể xác định ownership/an toàn merge;
- thiếu access, secret, dependency hoặc môi trường bắt buộc;
- baseline failure không thể quy cho change hiện tại;
- cùng một failure lặp lại mà không có evidence mới;
- verification bắt buộc không khả dụng hoặc kết quả không đáng tin.

Blocker phải có impact và next action cụ thể. Không retry vô hạn, không hạ
ngưỡng acceptance, không nuốt stderr/exit code và không đổi mode để che rủi ro.

## Route và completion report

Route result nên ngắn nhưng đủ để người thực thi hiểu quyết định:

```text
mode: Direct | Tracked | High-risk planned
outcome: <kết quả cần đạt>
scope: <artifact/code/doc cụ thể; non-goal nếu cần>
done when: <điều kiện observable>
verification: <command/check hoặc lý do không chạy>
artifacts: <chỉ các nguồn liên quan, nếu có>
escalation: <none hoặc trigger cần theo dõi>
```

Completion report chỉ cần:

```text
mode: <mode đã dùng>
scope/change: <đã thay đổi gì>
verification/evidence: <kết quả và đường dẫn evidence>
blockers/uncertainty: <none hoặc mô tả impact + next action>
```

Không biến route thành bảng trạng thái bắt buộc, reconnaissance rộng, cập nhật
toàn cục hoặc blanket check execution. Báo cáo trung thực phần đã làm, phần
chưa xác minh và quyết định tiếp theo.
