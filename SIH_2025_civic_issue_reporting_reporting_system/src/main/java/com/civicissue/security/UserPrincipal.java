package com.civicissue.security;

import com.civicissue.entity.Admin;
import com.civicissue.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {
    private Object user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    public UserPrincipal(Admin admin) {
        this.user = admin;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (user instanceof User) {
            return Collections.singletonList(new SimpleGrantedAuthority(((User) user).getRole().name()));
        } else if (user instanceof Admin) {
            return Collections.singletonList(new SimpleGrantedAuthority(((Admin) user).getRole().name()));
        }
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        if (user instanceof User) {
            return ((User) user).getPassword();
        } else if (user instanceof Admin) {
            return ((Admin) user).getPassword();
        }
        return null;
    }

    @Override
    public String getUsername() {
        if (user instanceof User) {
            return ((User) user).getVoterId();
        } else if (user instanceof Admin) {
            return ((Admin) user).getGovId();
        }
        return null;
    }

    public Long getUserId() {
        if (user instanceof User) {
            return ((User) user).getId();
        } else if (user instanceof Admin) {
            return ((Admin) user).getId();
        }
        return null;
    }

    public String getMunicipalArea() {
        if (user instanceof Admin) {
            return ((Admin) user).getWorkingMunicipalArea();
        }
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}