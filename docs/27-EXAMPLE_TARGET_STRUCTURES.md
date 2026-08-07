# Example Target Repository Structures

Các ví dụ dưới đây là **patterns**, không phải scaffold bắt buộc.

## 1. Single backend service

```text
repo/
├── AGENTS.md
├── ARCHITECTURE.md
├── feature_index.json
├── init.sh
├── docs/
│   ├── README.md
│   ├── BACKEND.md
│   └── specs/
│       ├── README.md
│       └── authentication.md
└── features/
    ├── feat-template.md
    └── feat-001.md
```

Không cần FRONTEND/MOBILE.

## 2. Full-stack app

```text
repo/
├── AGENTS.md
├── ARCHITECTURE.md
├── feature_index.json
├── init.sh
├── docs/
│   ├── README.md
│   ├── BACKEND.md
│   ├── FRONTEND.md
│   └── specs/
│       ├── README.md
│       ├── onboarding.md
│       └── billing.md
└── features/
```

## 3. Backend + frontend + mobile monorepo

```text
repo/
├── AGENTS.md
├── ARCHITECTURE.md
├── feature_index.json
├── init.sh
├── docs/
│   ├── README.md
│   ├── BACKEND.md
│   ├── FRONTEND.md
│   ├── MOBILE.md
│   ├── DATA.md          # only if shared data contracts are non-trivial
│   └── specs/
├── features/
└── scripts/
    └── verify/          # only if init orchestration needs helpers
```

`init.sh affected` có thể map changed workspace đến component jobs.

## 4. Existing legacy repo with good docs

Có thể chỉ cần:

```text
AGENTS.md
existing ARCHITECTURE.md
existing docs/
feature_index.json
features/
init.sh
```

`harness-map` SHOULD reuse links; không duplicate existing docs under new names.

## 5. Very small repo

Nếu project thực sự nhỏ, target có thể là:

```text
AGENTS.md
ARCHITECTURE.md
init.sh
```

Feature/spec layer MAY không cần nếu work đơn giản.

Corpus target là medium projects, nhưng "complexity must be earned" vẫn áp dụng.

## 6. Documentation-heavy/domain-heavy app

```text
docs/
├── README.md
├── BACKEND.md
├── FRONTEND.md
├── specs/
│   ├── README.md
│   ├── orders.md
│   ├── refunds.md
│   └── permissions.md
├── decisions/
│   └── event-delivery-semantics.md
└── references/
    └── payment-provider-contract.md
```

Chỉ thêm `decisions`/`references` khi behavior không thể hiểu an toàn nếu thiếu chúng.
