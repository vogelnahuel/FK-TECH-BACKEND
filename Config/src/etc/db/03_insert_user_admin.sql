INSERT INTO users(country,stores,document, "user",status,security_questions,sessions)
 VALUES ('AR', ARRAY ['LAR','TAR'],'12345678' ,'{
        "user_id": 1,
        "password":["be46d161e3e0bc74c9863a5a082be78b"],
        "creation_ts": "20220304095506",
        "active": 1,
        "system_pass": 0,
        "expirate": 1,
        "user_name": "admin",
        "role_id": 1,
        "role_name":"admin",
        "status_id": 1,
        "last_access_ts": null,
        "lockable": 1,
        "retries": 0,
        "retries_timestamp": "20220307103305",
        "first_name": "admin",
        "last_name": "admin",
        "language_id": null       
    }',
    '
     {"id":1,"name":"ACTIVE"}         
    ',
    '{
        "user_id": 1,
        "user_question": null,
        "answer": "admin",
        "system_question_key": "FAVORITE_COLOR"
    }',
    ' {
        "user_id": "1",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMzk3NjY1MDEiLCJpYXQiOjE2NDcyNzg2Nzd9.ak1-_4B_5DyctzSrjkSo3r2500ewqnTpMkmZmWjVHQU",
        "expiration": "20270314152434"
    }
    ') 
 ON CONFLICT (document,country) DO NOTHING;
